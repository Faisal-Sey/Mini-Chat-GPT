import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from chatbot import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/chat/<int:session_id>/", consumers.ChatConsumer.as_asgi()),
        ])
    ),
})