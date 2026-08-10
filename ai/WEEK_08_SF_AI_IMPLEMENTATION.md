# Week 08: SF AI AI Integration

## Implemented feature

Three SF AI-backed features are implemented: **Smart Farmer AI Chatbot** for farming questions, **crop-leaf visual assessment** for uploaded PNG/JPG/WEBP images, and a **crop-specific fertilizer planning guide**. They replace the previous hard-coded chatbot response, fixed `Tomato Late Blight` result, and fixed fertilizer-dose cards. Successful results are saved in the existing database history.

## Why AI is required

Farming questions are highly variable: crop, symptom, growth stage, location, soil, and weather context change every time. A fixed FAQ cannot give useful support for all of these combinations. SF AI turns the farmer's natural-language question into an understandable, contextual first response, while the system prompt keeps the guidance safe and Bangladesh-focused.

## Selected platform and model

- Platform: Google SF AI API
- Model: `SF AI-3.5-flash` (configured through `SF AI_MODEL`)
- Backend: Django REST API calls SF AI `generateContent` over HTTPS
- Training: **No custom model training is required.** SF AI is a pre-trained generative model. The application uses prompt engineering and existing saved chat context; it does not upload or train on farmer data.

## AI workflow

```text
Farmer text question, crop image, or selected crop
       |
React Chatbot, Disease Detection, or Fertilizer page
       |
Authenticated Django AI endpoint
       |
Django validates text/image/crop input
       |
SF AI API (task-specific safety prompt + user input)
       |
Django validates non-empty text and saves successful Q/A in PostgreSQL
       |
JSON response
       |
React displays a dynamic answer, visual assessment, or fertilizer plan
```

## Prompt engineering

### System prompt

The exact prompts are in `backend/apps/chatbot/SF AI_service.py`. They tell SF AI to respond in the farmer's language, use short practical Bangladesh-relevant farming guidance, avoid certainty and fabricated weather/market facts, and refer serious cases to agricultural officers. The image prompt requires a visual assessment rather than a guaranteed diagnosis. The fertilizer prompt prohibits universal dose claims and requires soil-test/local-extension confirmation.

### User prompt

The typed farmer question is sent as the final `user` message after validation (required, trimmed, maximum 1200 characters).

Example: `আমার ধানের পাতায় বাদামি দাগ হচ্ছে, কী করব?`

### Expected output

A concise Bangla response with safe next checks, one follow-up question if required, and a reminder to follow local agricultural-extension guidance and product labels before applying chemicals.

## Response validation and failure handling

| Situation | Handling |
|---|---|
| Empty/oversized question | Django returns validation error; SF AI is not called. |
| Empty/malformed AI response | Django rejects it and returns a clear retry message. |
| Network failure | Django returns a safe `503` message; the rest of the app keeps working. |
| SF AI timeout | The request stops after 25 seconds and returns `504`. |
| Rate limit (`429`) | User sees a wait-and-retry message. |
| Invalid/missing API key | The key never reaches the browser; backend reports a configuration problem. |
| Successful response | Response is displayed and saved in `ChatHistory`. |

## Setup instructions: API key location

1. Create a SF AI API key in Google AI Studio.
2. Copy `backend/.env.example` to `backend/.env`.
3. In `backend/.env`, replace this marked value with your key:

   ```env
   SF AI_API_KEY=PASTE_YOUR_SF AI_API_KEY_HERE
   ```

4. Never add the key to frontend `.env` and never commit it to Git.
5. Add your PostgreSQL settings in the same `backend/.env` file.
6. Start backend: `cd backend; python manage.py runserver`
7. Start frontend: `cd frontend; npm.cmd run dev`
8. Log in, open `/chatbot`, and ask a farming question.

If Vite uses a port other than `5173`, set `CORS_ALLOWED_ORIGINS` in `backend/.env`, for example: `CORS_ALLOWED_ORIGINS=http://localhost:5174,http://127.0.0.1:5174`.

## API contract

`POST /api/chat-history/ask/` for chatbot, `POST /api/disease-history/analyze/` for an image data URL, and `POST /api/fertilizer-recommendations/generate/` for a crop name.

```json
{ "question": "How can I prevent rice leaf disease?" }
```

Successful response:

```json
{ "id": "uuid", "question": "...", "response": "...", "date": "...", "model": "SF AI-3.5-flash" }
```

## Current limitations and future improvements

- Advice is a first response, not a replacement for a field inspection or agricultural officer.
- Real-time weather, market-price, soil-test, and farm-location data are not yet added to the prompt.
- Image assessment is not a laboratory diagnosis and accepts PNG/JPG/WEBP images up to 2 MB.
- Future work: consented farm profiles, RAG from verified Bangladesh agricultural-extension documents, voice support, local weather/soil-test context, response feedback, and automated safety evaluation.

## If a custom disease-detection model is added later

The SF AI chatbot needs no dataset or training. A separate leaf-disease classifier would need a labelled dataset (crop, disease class, healthy class), a field-aware train/validation/test split to avoid leakage, image-quality checks, augmentation, bias testing across lighting/crops, and agricultural-expert validation. Document dataset source/license, class counts, preprocessing, metrics, and limitations before deployment.
