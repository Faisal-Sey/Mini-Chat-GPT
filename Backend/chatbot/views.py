import random
import time
from threading import Thread

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from chatbot.models import ChatHistory, ChatSession

session_not_existing = "Session does not exist"


def datetime_to_string(datetime_obj):
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else ""


def get_weighted_chunk_length(remaining_length):
    possible_lengths = list(range(1, remaining_length + 1))
    weights = [1 / length for length in possible_lengths]
    normalized_weights = [weight / sum(weights) for weight in weights]
    return random.choices(possible_lengths, weights=normalized_weights, k=1)[0]


def send_websocket_messages(session_id, chat_history_info, question):
    channel_layer = get_channel_layer()
    if channel_layer is not None:
        start = 0

        while start < len(question):
            remaining_length = len(question) - start
            chunk_length = get_weighted_chunk_length(remaining_length)
            chunk = question[0:start]

            start += chunk_length

            async_to_sync(channel_layer.group_send)(
                f'chat_{session_id}',
                {
                    'type': 'chat_message',
                    'message': {
                        **chat_history_info,
                        "response": chunk
                    }
                }
            )

            time.sleep(0.2)
    else:
        print("Channel layer is not configured properly.")


class CreateChatMessageView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        user = self.request.user
        question = request.data.get('question')
        session_id = request.data.get('session_id')
        is_first_question = False

        session = None

        if session_id is not None:
            try:
                session = ChatSession.objects.get(id=session_id)
            except ObjectDoesNotExist:
                resp_data = {'status': 'error', "response": session_not_existing}
                return Response(resp_data, status=400)
        else:
            session = ChatSession.objects.create(user=user, name=question.lower())
            session_id = session.id
            is_first_question = True

        response_text = f"Here is your response: {question[::-1]}"

        chat_history_info = {
            "session_id": session_id,
            "question": question,
            "response": f"Here is your response: {question[::-1]}"
        }

        chat_history = ChatHistory.objects.create(**chat_history_info)

        if is_first_question:
            chat_history_info["session_name"] = question
            chat_history_info["session"] = {
                "id": session.id,
                "user_id": session.user.id,
                "name": session.name,
                "created_on": datetime_to_string(session.created_on),
                "updated_on": datetime_to_string(session.updated_on)
            }

        chat_history_info["created_on"] = datetime_to_string(chat_history.created_on)
        chat_history_info["id"] = chat_history.id
        chat_history_info["updated_on"] = datetime_to_string(chat_history.updated_on)

        thread = Thread(target=send_websocket_messages, args=(session_id, chat_history_info, response_text))
        thread.daemon = True
        thread.start()

        return JsonResponse({'status': 'success', "data": chat_history_info}, safe=False)


class GetChatSessionsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def get(self, request, *args, **kwargs):
        # retrieve user
        user = self.request.user

        # retrieve user chat sessions
        chat_sessions = list(ChatSession.objects.filter(user=user).values())

        return JsonResponse({'status': 'success', "data": chat_sessions}, safe=False)


class ManageChatSessionView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def get(self, request, *args, **kwargs):
        # retrieve user
        user = self.request.user
        session_id = kwargs.get('session_id')

        # retrieve user chat session
        try:
            chat_session = ChatSession.objects.get(id=session_id, user=user)
            chat_history = list(ChatHistory.objects.filter(session_id=chat_session.id).values())

            # construct response data
            resp_data = {
                "name": chat_session.name,
                "chat_history": chat_history
            }
            return JsonResponse({'status': 'success', "data": resp_data}, safe=False)
        except ObjectDoesNotExist:
            resp_data = {'status': 'error', "response": session_not_existing}
            return Response(resp_data, status=400)

    def delete(self, request, *args, **kwargs):
        # retrieve user
        user = self.request.user
        session_id = kwargs.get('session_id')

        # retrieve user chat session
        try:
            chat_session = ChatSession.objects.get(id=session_id, user=user)
            chat_session.delete()

            return JsonResponse({'status': 'success', "response": "Session deleted successfully"}, safe=False)
        except ObjectDoesNotExist:
            resp_data = {'status': 'error', "response": "Session does not exist"}
            return Response(resp_data, status=400)

    def put(self, request, *args, **kwargs):
        # retrieve user
        user = self.request.user
        session_id = kwargs.get('session_id')
        name = request.data.get('name')

        # retrieve user chat session
        try:
            chat_session = ChatSession.objects.get(id=session_id, user=user)
            chat_session.name = name
            chat_session.save()

            return JsonResponse({'status': 'success', "response": "Session updated successfully"}, safe=False)
        except ObjectDoesNotExist:
            resp_data = {'status': 'error', "response": session_not_existing}
            return Response(resp_data, status=400)