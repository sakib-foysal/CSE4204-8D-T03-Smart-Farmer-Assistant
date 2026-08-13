from django.urls import path

<<<<<<< HEAD
from apps.users.views import LoginAPIView, LogoutAPIView, ProfileAPIView, RegisterAPIView
=======
from apps.users.views import (
    AdminUserDetailAPIView,
    AdminDashboardAPIView,
    AdminUserListAPIView,
    LoginAPIView,
    LogoutAPIView,
    ProfileAPIView,
    RegisterAPIView,
)
>>>>>>> ai-integration


urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
<<<<<<< HEAD
]
=======
    path("admin/users/", AdminUserListAPIView.as_view(), name="admin-user-list"),
    path("admin/users/<uuid:id>/", AdminUserDetailAPIView.as_view(), name="admin-user-detail"),
    path("admin/dashboard/", AdminDashboardAPIView.as_view(), name="admin-dashboard"),
]
>>>>>>> ai-integration
