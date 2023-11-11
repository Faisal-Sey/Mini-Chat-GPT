from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.contrib.auth.views import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response


# login view
class LoginView(APIView):
    def post(self, request):
        # get user model
        user_model = get_user_model()

        # retrieve login credentials
        data = request.data

        email = data.get('email')
        password = data.get('password')

        # authenticate
        try:
            user = user_model.objects.get(username=email)
            if not user.check_password(password):
                resp_data = {'status': 'error', "message": "Invalid username or password"}
                return Response(resp_data, status=400)

        except ObjectDoesNotExist:
            resp_data = {'status': 'error', "message": "Invalid username or password"}
            return Response(resp_data, status=400)

        # generate token if user exists
        if user is not None:
            refresh = RefreshToken.for_user(user)  # accessing the refresh and access token
            user_info = {"id": user.id, "username": user.username, "first_name": user.first_name,
                         "last_name": user.last_name}
            data = {
                "user": user_info,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }

            return JsonResponse({'status': 'success', "data": data}, safe=False)


# signup view
class SignupView(APIView):
    def post(self, request):
        # get user model
        user_model = get_user_model()

        # retrieve signup credentials
        data = request.data

        email = data.get('email')
        password = data.get('password')

        # other information
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        # Check if user exists
        get_username = user_model.objects.filter(username=email)
        if len(get_username):
            resp_data = {'status': 'error', "message": "User already exists"}
            return Response(resp_data, status=400)

        # create user
        user = user_model.objects.create(
            username=email,
            password=make_password(password),
            first_name=first_name,
            last_name=last_name
        )

        refresh = RefreshToken.for_user(user)  # accessing the refresh and access token
        user_info = {"id": user.id, "username": user.username, "first_name": user.first_name,
                     "last_name": user.last_name}
        data = {
            "user": user_info,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }

        return JsonResponse({'status': 'success', "data": data})
