from django.urls import path
from . import views

urlpatterns = [
    path('messages', views.CreateChatMessageView.as_view(), name="create-chat-message"),
    path('sessions', views.GetChatSessionsView.as_view(), name="get-chat-sessions"),
    path('sessions/<int:session_id>', views.ManageChatSessionView.as_view(), name="manage-session"),
]