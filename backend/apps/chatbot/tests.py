from django.test import SimpleTestCase, override_settings

from types import SimpleNamespace

from apps.chatbot.sf_ai_service import SYSTEM_PROMPT, _fallback_farming_answer, _is_complete_answer, _model_id, _requested_language, _request_session


class SFAIServiceTests(SimpleTestCase):
    @override_settings(GEMINI_MODEL="Gemini-3.5-flash")
    def test_model_name_is_normalized_without_editing_env(self):
        self.assertEqual(_model_id(), "gemini-3.5-flash")

    def test_chat_response_language_follows_question_or_explicit_request(self):
        self.assertEqual(_requested_language("আমার ধানের পাতায় দাগ কেন?"), "bn")
        self.assertEqual(_requested_language("amar dhan gach er pata holud hoye jacche"), "bn")
        self.assertEqual(_requested_language("Why are my rice leaves turning yellow?"), "en")
        self.assertEqual(_requested_language("আমার ধানের পাতার সমস্যা ইংরেজিতে বলুন"), "en")

    def test_transient_requests_are_retried(self):
        session = _request_session()
        try:
            self.assertEqual(session.get_adapter("https://").max_retries.total, 2)
            self.assertFalse(session.trust_env)
        finally:
            session.close()

    def test_symptom_prompt_requires_treatment_details_before_medicine(self):
        self.assertIn("লক্ষণ", SYSTEM_PROMPT)
        self.assertIn("land area", SYSTEM_PROMPT)
        self.assertIn("label dose", SYSTEM_PROMPT)
        self.assertIn("Do not tell the farmer", SYSTEM_PROMPT)

    def test_fallback_is_complete_and_collects_treatment_details(self):
        answer = _fallback_farming_answer("আমার কলা গাছের পাতা কুঁকড়ে যাচ্ছে")
        self.assertTrue(_is_complete_answer(answer))
        self.assertIn("জমির পরিমাণ", answer)

    def test_any_crop_follow_up_uses_treatment_answer_after_details(self):
        history = [SimpleNamespace(question="আমার বাড়ির ঝাল গাছের পাতা কুঁকড়িয়ে যাচ্ছে কি করব?", response="তথ্য দিন")]
        answer = _fallback_farming_answer("ঝাল গাছের বয়স ২ মাস, ১০টা গাছ, বাড়ির ছাদে টবে, ৫ দিন সমস্যা।", history)
        self.assertIn("spinosad", answer)
        self.assertNotIn("জমির পরিমাণ বা গাছের সংখ্যা", answer)

    def test_banana_follow_up_uses_treatment_answer_after_details(self):
        history = [SimpleNamespace(question="কলা গাছের পাতায় কালো দাগ হচ্ছে", response="তথ্য দিন")]
        answer = _fallback_farming_answer("৬ মাসের ৪টি গাছ, বাড়ির আঙিনায়, ৭ দিন ধরে সমস্যা।", history)
        self.assertIn("ওষুধের ধরন", answer)
