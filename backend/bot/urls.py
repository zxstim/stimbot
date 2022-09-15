from django.urls import path, re_path
from . import views

urlpatterns = [
    path('list/', views.BotList.as_view(), name="list"),
    path('details/<int:bot_id>/', views.BotDetails.as_view(), name="details"),
    path('internal/<int:bot_id>/', views.internal_bot_details),
    path('internal/user/<int:bot_id>/<int:user_id>/', views.internal_user_bot_details),
    path('internal/log/list/', views.BotLogList.as_view(), name="log-list"),
    path('internal/log/<int:bot_id>/<int:rows>/', views.BotLogDetails.as_view(), name="log-details"),
    path('timestamp/', views.timestamp),
    path('upload/', views.FileUploadView.as_view()),
]