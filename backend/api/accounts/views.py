import os
import pyotp
from typing import Optional
from django.conf import settings
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.contrib.auth.hashers import check_password
from django.shortcuts import (
    get_object_or_404,
    redirect,
)
from django.utils import timezone
from rest_framework import (
    generics,
    status,
    viewsets
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer
from .utils import (
    get_access_token_from_api,
    get_tokens_for_user,
    store_token_in_cookies,
    get_access_token_google,
    get_access_token_42,
    create_user,
    get_user,
    get_user_info,
    send_otp_email,
    get_response,
    is_another_user,
    generate_otp_for_user,
    reset_code
)


class HomeView(APIView):
    """
    The home page view.
    """

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Return HTTP_200_OK response if the user is authenticated,
        HTTP_402_UNAUTHORIZED response otherwise.
        """
        serializer =  UserSerializer(request.user)

        if request.user.is_authenticated:
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LoginViewSet(viewsets.ViewSet):
    """
    A ViewSet for login a user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        """
        Get the username and the password from the request and try to
        authenticate the user.

        This method tries to authenticate the user with the username and the
        password given in request, and if the information are not valid, it
        returns a response indicating that the user with the given information
        does not exist, otherwise, this method authenticates the user and
        login the user.
        """
        username = request.data.get('username').lower()
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        print(user)
        if user:
            login(request, user)
            refresh_token, access_token = get_tokens_for_user(user)
            response = Response({
                'refresh_token': refresh_token,
                'access_token': access_token,
            }, status=status.HTTP_200_OK)
            store_token_in_cookies(response, access_token)
            return response
        if not User.objects.filter(username=username).exists():
            return Response({
                'error': 'A user with that username does not exist.'
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'error': 'A user with that password does not exist.'
        }, status=status.HTTP_404_NOT_FOUND)


class LoginWith2FAViewSet(viewsets.ViewSet):
    """
    A ViewSet for login a user with 2FA.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        """
        Read the username and the password from the request and try to
        authenticate the user.

        This function takes the request and tries to authenticate the user
        with the username and password existed in the request, and if the
        information are not valid it returns a response indicating that the
        user does not exist. Otherwise, authenticates the user.

        Args:
            request: A Request object containing the username and password
                supplied by the user.

        Returns:
            A Response object indicating if a user is successfully
            authenticated or the user does not exist.
        """
        username = request.data['username'].lower()
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            generate_otp_for_user(user)
            print(user.otp)
            send_otp_email(user)
            return Response({
                'info': 'The verification code sent successfully',
                'code': user.code
            }, status=status.HTTP_200_OK)
        if not User.objects.filter(username=username).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_404_NOT_FOUND)


class VerifyOTPViewSet(viewsets.ViewSet):
    """
    A ViewSet for verifying if the otp provided by the user is valid.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        print("===========> " ,request.data)
        otp = request.data['key']
        code = request.data['code'] # need code to specify the user
        try:
            user = User.objects.get(code=code)
            total_difference = timezone.now() - user.otp_created_at
            if total_difference.total_seconds() > 60 or otp != str(user.otp):
                return Response({'error': 'Key is incorrect'},
                                status=status.HTTP_400_BAD_REQUEST)
            reset_code(user)
            login(request, user)
            refresh_token, access_token = get_tokens_for_user(user)
            response = get_response({
                'refresh_token': refresh_token,
                'access_token': access_token,
            }, status.HTTP_200_OK)
            store_token_in_cookies(response, access_token)
            return response
        except User.DoesNotExist:
            return Response({'error':'Code is Incorrect'}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginViewSet(viewsets.ViewSet):
    """
    Login a user using Google

    This class requests an access token by authenticating with Google API, and
    fetches user information (such as username, first name, and last name).
    If the user does not exist, it creates a new one.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        access_token = get_access_token_google(authorization_code)
        userinfo_endpoint = ('https://openidconnect.googleapis.com/v1/userinfo'
                             '?scope=openid profile email')
        user_info, status_code = get_user_info(userinfo_endpoint, access_token)
        if status_code != 200:
            return Response(user_info, status=status_code)
        user = get_user(user_info, 'google')
        if not user:
            return Response({'error': 'Email is already in use'},
                        status=status.HTTP_400_BAD_REQUEST)
        if user.otp_active:
            generate_otp_for_user(user)
            print(user.otp)
            send_otp_email(user)
            return Response({
                'info': 'The verification code sent successfully',
                'code': user.code
            }, status=status.HTTP_200_OK)
        login(request, user)
        refresh_token, access_token = get_tokens_for_user(user)
        info = {'refresh_token': refresh_token, 'access_token': access_token}
        if not user.register_complete:
            info['info'] = 'The user needs to set a username'
        response = get_response(info, status.HTTP_200_OK)
        store_token_in_cookies(response, access_token)
        return response


#class GoogleLoginWith2FAViewSet(viewsets.ViewSet):
#    """
#    2FA with Google.

#    This class requests an access token by authenticating with Google API, and
#    fetches user information (such as username, first name, and last name).
#    If the user does not exist, it creates a new one.
#    """
#    permission_classes = [AllowAny]
#    authentication_classes = []

#    def get_access_token(self, authorization_code: str) -> str:
#        """
#        Get access token from the Google API.

#        This method makes a request to Google API to get the access token that
#        will be used to get user information. The request contains
#        authorization_code which is necessary to authenticate with the API.

#        Returns:
#            The access token.
#        """
#        token_endpoint = 'https://oauth2.googleapis.com/token'
#        payload = {
#            'code': authorization_code,
#            'client_id': os.getenv('GOOGLE_ID'),
#            'client_secret': os.getenv('GOOGLE_SECRET'),
#            'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI'),
#            'grant_type': 'authorization_code'
#        }
#        return get_access_token_from_api(token_endpoint, payload)

#    def create_user(self, user_info: dict[str, str]) -> Response:
#        """
#        Create a user and returns a response containing the user information
#        along with the refresh and access tokens.

#        This function use the create_user function from utils.py.
#        """
#        username = user_info['email'].split('@')[0].replace('.', '_').lower()
#        return create_user(username, user_info['email'])

#    def list(self, request: Request) -> Response:
#        """
#        Authenticate with the authorization server and obtain user information.
#        """
#        authorization_code = request.GET.get('code')
#        access_token = self.get_access_token(authorization_code)
#        userinfo_endpoint = ('https://openidconnect.googleapis.com/v1/userinfo'
#                             '?scope=openid profile email')
#        user_info, _ = get_user_info(userinfo_endpoint, access_token)
#        user = self.create_user(user_info)
#        send_otp_email(user)
#        return Response({
#            'detail': 'The verification code sent successfully',
#        }, status=status.HTTP_200_OK)


class IntraLoginViewSet(viewsets.ViewSet):
    """
    Login a user using 42 and associate with the user a refresh token
    and access token.

    This class requests an access token by authenticating with 42 API, and
    fetches user information (such as username, first name, last name,
    and email).
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        access_token = get_access_token_42(authorization_code)
        user_info, status_code = get_user_info('https://api.intra.42.fr/v2/me',
                                               access_token)
        if status_code != 200:
            return Response(user_info, status=status_code)
        user = get_user(user_info, 'intra')
        if user.otp_active:
            generate_otp_for_user(user)
            send_otp_email(user)
            print(user.otp)
            return Response({
                'info': 'The verification code sent successfully',
                'code': user.code
            }, status=status.HTTP_200_OK)
        login(request, user)
        refresh_token, access_token = get_tokens_for_user(user)
        info = {'refresh_token': refresh_token, 'access_token': access_token}
        if not user.register_complete:
            info['info'] ='The user needs to set a username'
        response = get_response(info, status.HTTP_200_OK)
        store_token_in_cookies(response, access_token)
        return response


#class IntraLoginWith2FAViewSet(viewsets.ViewSet):
#    """
#    2FA authentication with 42.

#    This class requests an access token by authenticating with 42 API, and
#    fetches user information (such as username, first name, last name,
#    and email).
#    """
#    permission_classes = [AllowAny]
#    authentication_classes = []

#    def get_access_token(self, authorization_code: str) -> str:
#        """
#        get access token using authorization code.

#        Returns:
#            str: The authorization code obtained from the authorization server.
#        """
#        token_endpoint = 'https://api.intra.42.fr/oauth/token'
#        payload = {
#            'grant_type': 'authorization_code',
#            'client_id': os.getenv('INTRA_ID'),
#            'client_secret': os.getenv('INTRA_SECRET'),
#            'redirect_uri': os.getenv('INTRA_REDIRECT_URI'),
#            'code': authorization_code
#        }
#        return get_access_token_from_api(token_endpoint, payload)

#    def list(self, request: Request) -> Response:
#        """
#        Authenticate with the authorization server and obtain user information.
#        """
#        authorization_code = request.GET.get('code', '')
#        access_token = self.get_access_token(authorization_code)
#        userinfo_endpoint = 'https://api.intra.42.fr/v2/me'
#        user_info, status_code = get_user_info(userinfo_endpoint, access_token)
#        if status_code != 200:
#            return Response(user_info, status=status.HTTP_400_BAD_REQUEST)
#        user = create_user(user_info['login'], user_info['email'])
#        send_otp_email(user)
#        return Response({
#            'detail': 'The verification code sent successfully',
#        }, status=status.HTTP_200_OK)


class RegisterViewSet(viewsets.ViewSet):
    """
    A ViewSet for creating new user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        data = request.data.copy()
        data['username'] = data['username'].lower() if data['username'] else None
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutViewSet(viewsets.ViewSet):
    """
    Logout a the currently active user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request: Request) -> Response:
        """
        Logout the user.
        """
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.AUTH_COOKIE)
        return response



#################################  UPDATE & DELETE & TOWFac_Send_email_setting VIEWS   ##############################


class UpdateUsernameView(APIView):
    """
        updating usernames for users 
        who have logged in via Intra or Google
        but have not completed 
        the registration process yet
    """
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        print("user =============> ", user)
        data = request.data.copy()
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            user.register_complete = True
            user.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserDataView(APIView):
    """
        update the user data:
          username
          email
          avatar
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data.copy()
        data['avatar'] = None
        if 'isRemove' in data:
            if  data['isRemove'] == 'yes': del data['avatar']
            if  data['isRemove'] == 'no' and 'avatar' in request.FILES:
                data['avatar'] = request.FILES['avatar']
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserPasswordView(APIView):
    """
        update the password
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        required_fields = ['CurrentPassword', 'password', 'confirmPassword']
        data = request.data.copy()

        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return Response(
                {field: "This field may not be blank." for field in missing_fields},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not check_password(data['CurrentPassword'], user.password):
            return Response(
                {"CurrentPassword": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if data['password'] != data['confirmPassword']:
            return Response(
                {"confirmPassword": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteUserAccountView(APIView):
    """
        delete user
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        if 'confirm' in request.data and request.data['confirm'] != 'yes':
            return Response(
                {"detail": "Account deletion not confirmed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        logout(request)
        user.delete()
        response = Response({"detail": "Your account has been successfully deleted."},status=status.HTTP_200_OK)
        response.delete_cookie(settings.AUTH_COOKIE)
        return response

class UserDetailView(APIView):
    """
    View to retrieve user details based on the provided username.
    """
    def get(self, request, username, format=None):
        """
        Retrieve user data by username.
        """
        user = get_object_or_404(User, username=username)
        serializer = UserSerializer(user)
        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)

# class GetIntraLink(APIView):
#     """
#         get intra link
#     """
#     permission_classes = [AllowAny]
#     authentication_classes = []
#     def get(self, request):
#         url =  request.META.get('HTTP_ORIGIN')
#         print("url ============> ",url)
#         data = f'https://api.intra.42.fr/oauth/authorize?client_id={settings.INTRA_ID}&redirect_uri={url+settings.INTRA_REDIRECT_URI}&response_type=code'
#         print(data)
#         return Response(data, status=status.HTTP_200_OK)

# class GetGoogleLink(APIView):
#     """
#         get google link
#     """
#     permission_classes = [AllowAny]
#     authentication_classes = []
#     def get(self, request):
#         url =  request.META.get('HTTP_ORIGIN')
#         data = f'https://accounts.google.com/o/oauth2/v2/auth?client_id={settings.GOOGLE_ID}&scope=openid profile email&response_type=code&display=popup&redirect_uri={url+settings.GOOGLE_REDIRECT_URI}'
#         return Response(data, status=status.HTTP_200_OK)


class GetIntraLink(APIView):
    """
        get intra link
    """
    permission_classes = [AllowAny]
    def get(self, request):
        data = f'https://api.intra.42.fr/oauth/authorize?client_id={settings.INTRA_ID}&redirect_uri={settings.INTRA_REDIRECT_URI}&response_type=code'
        return Response(data, status=status.HTTP_200_OK)

class GetGoogleLink(APIView):
    """
        get google link
    """
    permission_classes = [AllowAny]
    def get(self, request):
        data = f'https://accounts.google.com/o/oauth2/v2/auth?client_id={settings.GOOGLE_ID}&scope=openid profile email&response_type=code&display=popup&redirect_uri={settings.GOOGLE_REDIRECT_URI}'
        return Response(data, status=status.HTTP_200_OK)


class SendOTPView(APIView):
    """
        This view handles the generation and sending of OTP
        to the authenticated user (in setting)
        to activate the otp in user account
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, username):
        user = user = get_object_or_404(User, username=username)
        if request.data['val'] == True:
            user.seed = pyotp.random_base32()
            user.otp = pyotp.TOTP(user.seed).now()
            user.otp_created_at = timezone.now()
        else:
            user.otp_active = False
            user.otp = None
            user.save()
            return Response({'message': 'otp '}, status=status.HTTP_200_OK)
        user.save()
        send_otp_email(user)
        print(user.otp)
        return Response({'message': 'otp send successfaly'}, status=status.HTTP_200_OK)

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            print(user)
            val = user.otp_active
            print(val)
            return Response(val, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error' : e.args[0]}, status=status.HTTP_200_OK)

class checkValidOtp(APIView):
    """
     This view checks if the OTP entered by th user is valid(in setting)
     to activate the otp in user account
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        otp = request.data['key']
        total_difference = timezone.now() - user.otp_created_at
        if total_difference.total_seconds() > 60 or otp != str(user.otp):
            return Response({'error': 'Key is invalid'},
                            status=status.HTTP_400_BAD_REQUEST)
        user.otp_active = not user.otp_active
        user.save()
        return Response ({'message': 'key is valid'}, status=status.HTTP_200_OK)
