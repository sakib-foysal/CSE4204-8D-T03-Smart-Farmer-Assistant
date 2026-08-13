"""Small, dependency-free SF AI client used by the farming chatbot."""

import logging
import os
import json
import re

import requests
from django.conf import settings
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Smart Farmer Assistant, a careful agriculture support assistant for farmers in Bangladesh.
Answer in the same language as the farmer (Bangla, English, or mixed Bangla-English). Give practical, short, numbered advice about crops, pests, diseases, irrigation, fertilizer, weather preparedness, and market planning.
Ask one concise follow-up question when crop, symptom, location, growth stage, or soil condition is needed. Clearly state that exact pesticide/fertilizer dose must follow local agricultural-extension guidance and product labels. Do not diagnose with certainty from text alone, do not invent weather or market data, and recommend a local agriculture officer for severe crop loss, poisoning, or urgent safety issues.
Do not use Markdown tables. Keep the response under 220 words."""


class SFAIServiceError(Exception):
    """An expected, safe-to-display SF AI service failure."""

    def __init__(self, message, status_code=503):
        super().__init__(message)
        self.status_code = status_code


def _extract_text(payload):
    candidates = payload.get("candidates") or []
    if not candidates:
        return ""
    parts = (candidates[0].get("content") or {}).get("parts") or []
    return "\n".join(part.get("text", "").strip() for part in parts if part.get("text")).strip()


def _model_id():
    """Normalize the provider model ID without changing the user's .env file."""
    configured = str(getattr(settings, "GEMINI_MODEL", "gemini-3.5-flash")).strip()
    return configured.lower().removeprefix("models/")


def _request_session():
    """Retry only transient connection/server failures; never bypass TLS validation."""
    retry = Retry(
        total=2,
        connect=2,
        read=2,
        status=1,
        backoff_factor=0.4,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset({"POST"}),
        raise_on_status=False,
    )
    session = requests.Session()
    # The developer environment contains a stale localhost proxy. Bypassing it
    # lets the backend make its direct, TLS-verified API connection.
    session.trust_env = False
    session.mount("https://", HTTPAdapter(max_retries=retry))
    return session


def _request_sf_ai(body):
    """Send a GenerateContent request and return its non-empty text response."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SFAIServiceError(
            "SF AI is not configured. Please add your AI service key to backend/.env and restart the backend.",
            503,
        )

    model = _model_id()
    if not model:
        raise SFAIServiceError("SF AI model is not configured. Please contact the administrator.", 503)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    try:
        with _request_session() as session:
            response = session.post(
                url,
                headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
                json=body,
                timeout=getattr(settings, "GEMINI_TIMEOUT_SECONDS", 25),
            )
    except requests.Timeout as exc:
        raise SFAIServiceError("SF AI timed out. Please try again in a moment.", 504) from exc
    except requests.RequestException as exc:
        logger.warning("SF AI network error: %s", exc)
        raise SFAIServiceError("SF AI is temporarily unavailable. Please try again later.", 503) from exc

    if response.status_code == 429:
        raise SFAIServiceError("SF AI request limit reached. Please wait a moment and try again.", 429)
    if response.status_code in (401, 403):
        logger.error("SF AI authentication failed with status %s", response.status_code)
        raise SFAIServiceError("SF AI configuration is invalid. Please contact the administrator.", 503)
    if not response.ok:
        logger.warning("SF AI error %s: %s", response.status_code, response.text[:500])
        raise SFAIServiceError("SF AI could not answer right now. Please try again later.", 503)

    try:
        answer = _extract_text(response.json())
    except ValueError as exc:
        raise SFAIServiceError("SF AI returned an invalid response. Please try again.", 502) from exc
    if not answer:
        raise SFAIServiceError("SF AI returned an empty response. Please rephrase your question.", 502)
    return answer


def _json_response(body):
    raw_text = _request_sf_ai(body).strip()
    # Models sometimes wrap otherwise valid JSON in a Markdown code fence.
    # Accept that transport formatting, but still reject non-JSON output.
    if raw_text.startswith("```"):
        raw_text = raw_text.split("\n", 1)[-1]
        if raw_text.rstrip().endswith("```"):
            raw_text = raw_text.rstrip()[:-3].rstrip()
    if not raw_text.startswith("{"):
        start, end = raw_text.find("{"), raw_text.rfind("}")
        if start != -1 and end > start:
            raw_text = raw_text[start:end + 1]
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise SFAIServiceError("SF AI returned an invalid assessment. Please try again.", 502) from exc


def ask_sf_ai(question, history=None):
    """Return a validated plain-text response from SF AI."""
    contents = [{"role": "user", "parts": [{"text": question}]}]

    body = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {"maxOutputTokens": 500},
    }
    return _request_sf_ai(body)


def analyze_crop_image(image_base64, mime_type, crop_hint=""):
    prompt = """You are an agricultural visual-assessment assistant for Bangladesh. Analyze only what is visibly supported by this crop/leaf image. Do not claim a laboratory-confirmed diagnosis. If this is not a crop/leaf image, say so. Reply in plain text using these exact labels on separate lines: PREDICTION: short likely issue or 'No clear disease visible'; CONFIDENCE: a visual confidence number from 0 to 100; TREATMENT: short safe next steps; DISCLAIMER: one concise safety note. Use Bangla when the crop hint is Bangla, otherwise English. Avoid exact chemical dose; advise confirming pesticide/fungicide choices with local agricultural extension and product labels."""
    if crop_hint:
        prompt += f" Crop hint supplied by farmer: {crop_hint}."
    text = _request_sf_ai({
        "systemInstruction": {"parts": [{"text": prompt}]},
        "contents": [{"role": "user", "parts": [
            {"text": "Assess this image."},
            {"inlineData": {"mimeType": mime_type, "data": image_base64}},
        ]}],
        "generationConfig": {"maxOutputTokens": 700},
    })
    labels = {}
    for label in ("PREDICTION", "CONFIDENCE", "TREATMENT", "DISCLAIMER"):
        match = re.search(rf"(?im)^\s*{label}\s*:\s*(.+?)(?=^\s*(?:PREDICTION|CONFIDENCE|TREATMENT|DISCLAIMER)\s*:|\Z)", text, re.DOTALL)
        if match:
            labels[label.lower()] = match.group(1).strip()
    # Do not discard a useful SF AI response merely because it did not follow
    # the requested labels perfectly. The full assessment is still displayed.
    return {
        "prediction": labels.get("prediction", "SF AI visual crop assessment"),
        "confidence": labels.get("confidence", "0"),
        "treatment": labels.get("treatment", text),
        "disclaimer": labels.get("disclaimer", "This is an AI visual assessment, not a laboratory-confirmed diagnosis."),
    }


def generate_fertilizer_plan(crop, context=""):
    prompt = """You are a careful Bangladesh agriculture assistant. Create a general fertilizer planning guide, not a prescription. Return JSON only with keys: crop, fertilizers (array of objects with name, amount, timing), tips (array of strings), disclaimer. Never invent soil-test results and never present exact application rates as universally correct; clearly ask the farmer to confirm dose with a soil test, local agricultural extension officer, and product label. Use simple language."""
    question = f"Crop: {crop}. Farm context: {context or 'not provided'}"
    return _json_response({
        "systemInstruction": {"parts": [{"text": prompt}]},
        "contents": [{"role": "user", "parts": [{"text": question}]}],
        "generationConfig": {"responseMimeType": "application/json", "maxOutputTokens": 700},
    })
