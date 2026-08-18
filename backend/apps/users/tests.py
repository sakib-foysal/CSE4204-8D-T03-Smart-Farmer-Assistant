from rest_framework.test import APITestCase
import json

from apps.chatbot.models import ChatHistory
from apps.weather.models import WeatherData
from apps.users.models import User, RevokedToken


class AuthenticationAPITests(APITestCase):

	def setUp(self):
		self.register_payload = {
			"username": "farmer1",
			"email": "farmer1@example.com",
			"password": "StrongPass123",
			"phone": "+8801712345678",
			"role": "farmer",
		}
		self.user = User.objects.create_user(
			username="demo",
			email="demo@example.com",
			password="StrongPass123",
			phone="+8801812345678",
			role="farmer",
		)

	def test_register_returns_token(self):
		response = self.client.post("/api/register/", self.register_payload, format="json")
		self.assertEqual(response.status_code, 201)
		self.assertIn("access_token", response.data)
		self.assertTrue(User.objects.filter(username="farmer1").exists())

	def test_register_rejects_incomplete_bangladesh_phone_number(self):
		payload = {**self.register_payload, "username": "shortphone", "email": "shortphone@example.com", "phone": "+880171234567"}
		response = self.client.post("/api/register/", payload, format="json")
		self.assertEqual(response.status_code, 400)
		self.assertIn("phone", response.data)

	def test_login_returns_token(self):
		response = self.client.post(
			"/api/login/",
			{"identifier": "demo", "password": "StrongPass123"},
			format="json",
		)
		self.assertEqual(response.status_code, 200)
		self.assertIn("access_token", response.data)

	def test_profile_requires_token(self):
		response = self.client.get("/api/profile/")
		self.assertEqual(response.status_code, 403)

	def test_profile_get_and_update(self):
		login = self.client.post(
			"/api/login/",
			{"identifier": "demo", "password": "StrongPass123"},
			format="json",
		)
		token = login.data["access_token"]
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

		profile = self.client.get("/api/profile/")
		self.assertEqual(profile.status_code, 200)

		update = self.client.put(
			"/api/profile/",
			{"first_name": "Updated"},
			format="json",
		)
		self.assertEqual(update.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.first_name, "Updated")

	def test_logout_revokes_token(self):
		login = self.client.post(
			"/api/login/",
			{"identifier": "demo", "password": "StrongPass123"},
			format="json",
		)
		token = login.data["access_token"]
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

		response = self.client.post("/api/logout/", {}, format="json")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(RevokedToken.objects.count(), 1)

	def test_admin_can_list_update_and_delete_database_users(self):
		admin = User.objects.create_user(
			username="adminuser",
			email="admin@example.com",
			password="StrongPass123",
			role="admin",
		)
		login = self.client.post(
			"/api/login/",
			{"identifier": "adminuser", "password": "StrongPass123"},
			format="json",
		)
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access_token']}")
		dashboard_response = self.client.get("/api/admin/dashboard/")
		self.assertEqual(dashboard_response.status_code, 200)
		self.assertEqual(dashboard_response.data["stats"]["total_users"], 2)
		self.assertEqual(len(dashboard_response.data["activity"]), 7)
		self.assertEqual(len(dashboard_response.data["recent_users"]), 2)

		list_response = self.client.get("/api/admin/users/")
		self.assertEqual(list_response.status_code, 200)
		self.assertEqual(len(list_response.data), 2)

		update_response = self.client.patch(
			f"/api/admin/users/{self.user.id}/",
			{"first_name": "Managed", "is_active": False},
			format="json",
		)
		self.assertEqual(update_response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.first_name, "Managed")
		self.assertFalse(self.user.is_active)

		delete_response = self.client.delete(f"/api/admin/users/{self.user.id}/")
		self.assertEqual(delete_response.status_code, 204)
		self.assertFalse(User.objects.filter(id=self.user.id).exists())

	def test_non_admin_cannot_access_user_management_api(self):
		login = self.client.post(
			"/api/login/",
			{"identifier": "demo", "password": "StrongPass123"},
			format="json",
		)
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access_token']}")
		response = self.client.get("/api/admin/users/")
		self.assertEqual(response.status_code, 403)
		self.assertEqual(self.client.get("/api/admin/dashboard/").status_code, 403)


class ProjectApiSmokeTests(APITestCase):

	def setUp(self):
		self.user = User.objects.create_user(
			username="projectuser",
			email="project@example.com",
			password="StrongPass123",
			phone="+8801912345678",
			role="farmer",
		)
		login = self.client.post(
			"/api/login/",
			{"identifier": "projectuser", "password": "StrongPass123"},
			format="json",
		)
		self.token = login.data["access_token"]
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

	def test_chat_history_create_and_list(self):
		create = self.client.post(
			"/api/chat-history/",
			{"question": "How to protect crops?", "response": "Use proper irrigation."},
			format="json",
		)
		self.assertEqual(create.status_code, 201)
		self.assertEqual(ChatHistory.objects.count(), 1)

		list_response = self.client.get("/api/chat-history/")
		self.assertEqual(list_response.status_code, 200)
		self.assertEqual(len(list_response.data), 1)

	def test_weather_data_create_and_list(self):
		create = self.client.post(
			"/api/weather-data/",
			{"temperature": 28.5, "humidity": 70.0, "rainfall": 12.3, "flood_risk": "low"},
			format="json",
		)
		self.assertEqual(create.status_code, 201)
		self.assertEqual(WeatherData.objects.count(), 1)

		list_response = self.client.get("/api/weather-data/")
		self.assertEqual(list_response.status_code, 200)
		self.assertEqual(len(list_response.data), 1)

	def test_health_endpoint(self):
		response = self.client.get("/api/health/")
		self.assertEqual(response.status_code, 200)
		payload = json.loads(response.content)
		self.assertEqual(payload["status"], "ok")
