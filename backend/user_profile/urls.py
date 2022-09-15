from django.urls import path, re_path
from . import views

urlpatterns = [
    path('profile/', views.UserProfileDetails.as_view(), name="user profile"),
    path('generate-secret-key/', views.generate_secret_key_for_user),
]