from django.test import SimpleTestCase, override_settings

from apps.chatbot.sf_ai_service import _model_id, _request_session


class SFAIServiceTests(SimpleTestCase):
    @override_settings(GEMINI_MODEL="Gemini-3.5-flash")
    def test_model_name_is_normalized_without_editing_env(self):
        self.assertEqual(_model_id(), "gemini-3.5-flash")

    def test_transient_requests_are_retried(self):
        session = _request_session()
        try:
            self.assertEqual(session.get_adapter("https://").max_retries.total, 2)
            self.assertFalse(session.trust_env)
        finally:
            session.close()
