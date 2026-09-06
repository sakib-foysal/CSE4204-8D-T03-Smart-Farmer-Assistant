"""Live, no-key weather forecast and farmer alert service."""

import logging
from datetime import date
from itertools import groupby

import requests
from django.core.cache import cache
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


logger = logging.getLogger(__name__)
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
KHULNA = {"latitude": 22.8456, "longitude": 89.5403}


def _weather_session():
    """Create a short-lived client that tolerates transient provider errors."""
    retry = Retry(
        total=2,
        connect=2,
        read=2,
        status=2,
        backoff_factor=0.4,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset(("GET",)),
    )
    adapter = HTTPAdapter(max_retries=retry)
    session = requests.Session()
    session.mount("https://", adapter)
    return session

ALERT_GUIDANCE = {
    "flood": {
        "message": "অতি ভারী বৃষ্টিতে জলাবদ্ধতা বা বন্যার সম্ভাবনা আছে।",
        "do": ["জমির নালা ও পানি বের হওয়ার পথ পরিষ্কার রাখুন।", "বীজ, সার ও যন্ত্রপাতি উঁচু ও শুকনা স্থানে রাখুন।", "নিরাপদ আশ্রয় ও যোগাযোগের প্রস্তুতি রাখুন।"],
        "avoid": ["পানিবদ্ধ জমিতে বিদ্যুৎচালিত যন্ত্র ব্যবহার করবেন না।", "বন্যার পানিতে হেঁটে বা গবাদিপশু নিয়ে ঝুঁকিপূর্ণ পথে যাবেন না।"],
    },
    "rain": {
        "message": "ভারী বৃষ্টির সম্ভাবনা আছে।",
        "do": ["জমিতে পানি জমছে কি না নিয়মিত দেখুন।", "কাটা ফসল ও বীজ ঢেকে শুকনা জায়গায় রাখুন।"],
        "avoid": ["বৃষ্টি চলাকালে সার বা কীটনাশক প্রয়োগ করবেন না।", "ভেজা জমিতে ভারী যন্ত্র চালাবেন না।"],
    },
    "lightning": {
        "message": "বজ্রঝড়ের সম্ভাবনা আছে।",
        "do": ["নিরাপদ পাকা ঘরে আশ্রয় নিন।", "কাজের লোক ও গবাদিপশুকে দ্রুত নিরাপদ স্থানে আনুন।"],
        "avoid": ["খোলা মাঠ, গাছ, জলাশয় ও বিদ্যুতের খুঁটির কাছে থাকবেন না।", "মোবাইল চার্জে দেওয়া বা বৈদ্যুতিক যন্ত্র ব্যবহার এড়িয়ে চলুন।"],
    },
    "wind": {
        "message": "দমকা হাওয়ার সম্ভাবনা আছে।",
        "do": ["চারা, মাচা ও খুঁটির সহায়তা দেওয়া ফসল শক্ত করে বেঁধে দিন।", "হালকা কৃষি সরঞ্জাম নিরাপদে রাখুন।"],
        "avoid": ["দুর্বল গাছ বা টিনের ঘরের পাশে কাজ করবেন না।", "স্প্রে করা বা উঁচুতে কাজ করা এড়িয়ে চলুন।"],
    },
    "heat": {
        "message": "তাপমাত্রা বেশি থাকার সম্ভাবনা আছে।",
        "do": ["সকাল বা বিকেলে সেচ দিন।", "গাছের গোড়ায় মালচ দিয়ে আর্দ্রতা ধরে রাখুন।"],
        "avoid": ["দুপুরের তীব্র রোদে দীর্ঘ সময় মাঠে কাজ করবেন না।", "চারা শুকিয়ে গেলে অতিরিক্ত সার প্রয়োগ করবেন না।"],
    },
}

ENGLISH_ALERT_GUIDANCE = {
    "flood": {
        "message": "Very heavy rain may cause waterlogging or flooding.",
        "do": ["Keep field drains and water outlets clear.", "Store seeds, fertilizer, and equipment in a high, dry place.", "Prepare safe shelter and communication arrangements."],
        "avoid": ["Do not use electrical equipment in waterlogged fields.", "Do not walk through floodwater or use unsafe routes with livestock."],
    },
    "rain": {
        "message": "Heavy rain is possible.",
        "do": ["Check regularly for standing water in fields.", "Keep harvested crops and seeds covered in a dry place."],
        "avoid": ["Do not apply fertilizer or pesticides while it is raining.", "Do not operate heavy machinery on wet fields."],
    },
    "lightning": {
        "message": "Thunderstorms are possible.",
        "do": ["Take shelter in a safe permanent building.", "Move workers and livestock quickly to a safe place."],
        "avoid": ["Stay away from open fields, trees, water bodies, and power poles.", "Avoid charging phones or using electrical equipment."],
    },
    "wind": {
        "message": "Strong winds are possible.",
        "do": ["Secure seedlings, trellises, and supported crops.", "Store light farming equipment safely."],
        "avoid": ["Do not work beside weak trees or tin-roofed structures.", "Avoid spraying or working at height."],
    },
    "heat": {
        "message": "High temperatures are possible.",
        "do": ["Irrigate in the morning or late afternoon.", "Use mulch around plants to retain soil moisture."],
        "avoid": ["Avoid long field work in intense midday sun.", "Do not apply excessive fertilizer to drought-stressed seedlings."],
    },
}


def _risk_and_alert_types(rainfall, wind_speed, weather_code, temperature):
    """Derive only the alerts warranted by this day's live forecast values."""
    alerts = []
    risk = "low"
    if rainfall >= 80:
        risk = "high"
        alerts.append(("flood", "high"))
    elif rainfall >= 35:
        risk = "medium"
        alerts.append(("rain", "medium"))
    if weather_code in {95, 96, 99}:
        alerts.append(("lightning", "high"))
    if wind_speed >= 40:
        alerts.append(("wind", "medium"))
    if temperature >= 36:
        alerts.append(("heat", "medium"))
    return risk, alerts


def group_consecutive_alerts(alerts, language="bn"):
    """Merge same-type/same-severity alerts occurring on consecutive forecast days."""
    grouped = []
    ordered_alerts = sorted(alerts, key=lambda item: (item["type"], item["severity"], item["date"]))
    for (kind, severity), matching in groupby(ordered_alerts, key=lambda item: (item["type"], item["severity"])):
        ordered = list(matching)
        run = []
        for item in ordered:
            if not run or (date.fromisoformat(item["date"]) - date.fromisoformat(run[-1]["date"])).days == 1:
                run.append(item)
            else:
                grouped.append(_alert_run(kind, severity, run, language))
                run = [item]
        if run:
            grouped.append(_alert_run(kind, severity, run, language))
    return sorted(grouped, key=lambda item: (item["start_date"], item["type"]))


def _alert_run(kind, severity, run, language):
    guidance = (ENGLISH_ALERT_GUIDANCE if language == "en" else ALERT_GUIDANCE)[kind]
    return {
        "type": kind,
        "severity": severity,
        "start_date": run[0]["date"],
        "end_date": run[-1]["date"],
        "days": len(run),
        **guidance,
    }


def get_seven_day_forecast(language="bn"):
    """Return current conditions, a seven-day forecast, and dynamic grouped alerts."""
    language = "en" if language == "en" else "bn"
    cache_key = f"weather:khulna:seven-day:v4:{language}"
    cached = cache.get(cache_key)
    if cached:
        return cached
    try:
        # Keep Requests' normal environment handling. Hosting providers can
        # supply outbound-network proxy settings through their environment.
        with _weather_session() as session:
            response = session.get(FORECAST_URL, params={
                **KHULNA,
                "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
                "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
                "hourly": "precipitation_probability,precipitation",
                "timezone": "Asia/Dhaka", "forecast_days": 7,
            }, timeout=12)
        response.raise_for_status()
        payload = response.json()
        daily, current, hourly = payload["daily"], payload["current"], payload["hourly"]
    except (requests.RequestException, ValueError, KeyError, TypeError) as exc:
        logger.warning("Live weather forecast failed: %s", exc)
        raise WeatherServiceError("লাইভ আবহাওয়ার তথ্য এখন পাওয়া যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।") from exc

    raw_alerts, forecast = [], []
    for index, forecast_date in enumerate(daily["time"]):
        rainfall = float(daily["precipitation_sum"][index] or 0)
        wind_speed = float(daily["wind_speed_10m_max"][index] or 0)
        weather_code = int(daily["weather_code"][index] or 0)
        max_temp = float(daily["temperature_2m_max"][index])
        risk, alert_types = _risk_and_alert_types(rainfall, wind_speed, weather_code, max_temp)
        forecast.append({"date": forecast_date, "temperature_max": max_temp, "temperature_min": float(daily["temperature_2m_min"][index]), "rainfall": rainfall, "rain_probability": int(daily["precipitation_probability_max"][index] or 0), "wind_speed": wind_speed, "weather_code": weather_code, "flood_risk": risk})
        raw_alerts.extend({"date": forecast_date, "type": kind, "severity": severity} for kind, severity in alert_types)

    hourly_forecast = [{"date": timestamp[:10], "time": timestamp, "rain_probability": int(hourly["precipitation_probability"][index] or 0), "rainfall": float(hourly["precipitation"][index] or 0)} for index, timestamp in enumerate(hourly["time"])]
    location = "Khulna, Bangladesh" if language == "en" else "খুলনা, বাংলাদেশ"
    result = {"location": location, "updated_at": current.get("time"), "current": {"temperature": float(current["temperature_2m"]), "humidity": int(current["relative_humidity_2m"]), "rainfall": float(current["precipitation"]), "wind_speed": float(current["wind_speed_10m"]), "weather_code": int(current["weather_code"])}, "forecast": forecast, "hourly": hourly_forecast, "alerts": group_consecutive_alerts(raw_alerts, language)}
    cache.set(cache_key, result, 900)
    return result


class WeatherServiceError(Exception):
    pass
