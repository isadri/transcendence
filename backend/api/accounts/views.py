from ..game.models import UserAchievement, UserStats
import json
import pyotp
import os
import redis
import secrets
from cryptography.fernet import Fernet
from typing import Optional
from django.conf import settings
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import (
    get_object_or_404,
)
from django.utils import timezone
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)
from django.utils.encoding import force_bytes
from rest_framework import (
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
from .mails import (
    send_email_verification,
    send_email,
)
from .utils import (
    get_tokens_for_user,
    store_token_in_cookies,
    get_access_token_google,
    get_access_token_42,
    get_user,
    get_user_info,
    send_otp_email,
    send_otp_to,
    get_response,
    get_url,
    generate_otp_for_user,
    reset_code,
    validate_token,
    check_otp_key,
    add_level_achievement_to_user,
    add_game_achievement_to_user,
    add_milestone_achievement_to_user,
    generate_signature,
)

from ..friends.models import FriendRequest
from django.db.models import Q
class HomeView(APIView):
    """
    The home page view.
    """

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Return HTTP_200_OK response if the user is authenticated,
        HTTP_402_UNAUTHORIZED response otherwise.
        """
        if request.user.is_authenticated:
            if not request.user.register_complete:
                logout(request)
                response = Response(status=status.HTTP_401_UNAUTHORIZED)
                response.delete_cookie(settings.AUTH_COOKIE)
                return response
            request.user.open_chat = False
            add_level_achievement_to_user(request.user)
            add_game_achievement_to_user(request.user)
            add_milestone_achievement_to_user(request.user)
            
            serializer =  UserSerializer(request.user)
            data = serializer.data
            return Response(data, status=status.HTTP_200_OK)
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
        if user:
            if not user.email_verified:
                return Response({
                    'error': 'You need to verify your email.'
                }, status=status.HTTP_400_BAD_REQUEST)
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
            if not user.email_verified:
                return Response({
                    'error': 'You need to verify your email.'
                }, status=status.HTTP_400_BAD_REQUEST)
            generate_otp_for_user(user)
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
        otp = request.data['key']
        code = request.data['code'] # need code to specify the user
        try:
            user = User.objects.get(code=code)
            if not check_otp_key(otp, user):
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
            return Response({'error':'Code is Incorrect'},
                            status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginViewSet(viewsets.ViewSet):
    """
    Login a user using Google

    This class requests an access token by authenticating with Google API, and
    fetches user information (such as username, first name, and last name).
    If the user does not exist, it creates a new one.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def _get_user(self, user_info: dict) -> User:
        """
        This methods calls the get_user() function and passes to it the data
        that is required to get the user or create a new one.
        """
        username = user_info.get('email').split('@')[0].replace('.', '_').lower()
        data = {
            'username': username,
            'email': user_info.get('email'),
            'remote_id': ['GOOGLE-' + str(user_info.get('sub'))],
            'avatar_url': user_info.get('picture'),
        }
        return get_user(data)

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        redirect_url =  get_url(request, settings.GOOGLE_REDIRECT_URI)
        access_token = get_access_token_google(redirect_url, authorization_code)
        userinfo_endpoint = ('https://openidconnect.googleapis.com/v1/userinfo'
                             '?scope=openid profile email')
        user_info, status_code = get_user_info(userinfo_endpoint, access_token)
        if status_code != 200:
            return Response(user_info, status=status_code)
        user = self._get_user(user_info)
        if user.otp_active:
            generate_otp_for_user(user)
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

    def _get_user(self, user_info: dict) -> User:
        """
        This methods calls the get_user() function and passes to it the data
        that is required to get the user or create a new one.
        """
        data = {
            'username': user_info.get('login'),
            'email': user_info.get('email'),
            'remote_id': ['INTRA-' + str(user_info.get('id'))],
            'avatar_url': user_info.get('image').get('link'),
        }
        return get_user(data)

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        redirect_url =  get_url(request, settings.INTRA_REDIRECT_URI)
        access_token = get_access_token_42(redirect_url, authorization_code)
        user_info, status_code = get_user_info('https://api.intra.42.fr/v2/me',
                                               access_token)
        if status_code != 200:
            return Response(user_info, status=status_code)
        user = self._get_user(user_info)
        if user.otp_active:
            generate_otp_for_user(user)
            send_otp_email(user)
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


class RegisterViewSet(viewsets.ViewSet):
    """
    A ViewSet for creating new user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def _encode_data(self, data: dict) -> str:
        """
        Convert data to a JSON string and return the string encoded.
        """
        json_data = json.dumps(data)
        encoded_data = urlsafe_base64_encode(force_bytes(json_data))
        return encoded_data

    def _generate_token(self, encoded_payload: str, signature: str) -> str:
        """
        Convert the encoded payload and the signature to a JSON string and
        then encode the string to create a token.
        """
        json_data = json.dumps({
            'payload': encoded_payload, 'signature': signature
        })
        return urlsafe_base64_encode(force_bytes(json_data))

    def create(self, request: Request) -> Response:
        """
        Create a token that contains the user information along with a
        signature used to verify the user information when they are returned
        from the client.
        """
        data = request.data.copy()
        data['username'] = data['username'].lower() if data['username'] else None
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            f = Fernet(settings.FERNET_KEY)
            data['password'] = f.encrypt(force_bytes(data['password'])).decode()
            encoded_data = self._encode_data(data)
            secret = settings.SECRET_KEY
            secret = urlsafe_base64_encode(force_bytes(secret))
            signature = generate_signature(encoded_data + secret)
            token = self._generate_token(encoded_data, signature)
            url = get_url(request)
            uid = urlsafe_base64_encode(force_bytes(data['username']))
            confirmation_url = (
                url+'emailVerified'
                f'?uid={uid}&token={token}'
            )
            send_email_verification(data['email'], confirmation_url)
            return Response({'message': 'Check your email to confirm'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmEmailViewSet(viewsets.ViewSet):
    """
    A viewset for validating the user email.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request: Request) -> Response:
        """
        Validate the token given in the url.

        This method get the token given the requested url and extract
        the information needed for verification. The token contains the payload
        which is used to create a signature and verify if it matches the
        signature contained in the token, and if it is valid decode the payload
        and then decrypt the password to create the user.
        If the signature contained in the token does not match the signature
        created using the payload, then this token is not valid.
        """
        token = request.GET.get('token')
        try:
            data = json.loads(urlsafe_base64_decode(token).decode())
            encoded_data = data['payload']
            secret = settings.SECRET_KEY
            secret = urlsafe_base64_encode(force_bytes(secret))
            signature = generate_signature(encoded_data + secret)
            if signature != data['signature']:
                return Response({'error': 'email validation failed'},
                                status=status.HTTP_400_BAD_REQUEST)
            payload = json.loads(urlsafe_base64_decode(encoded_data).decode())
            f = Fernet(settings.FERNET_KEY)
            try:
                payload['password'] = f.decrypt(payload['password']).decode()
            except cryptography.fernet.InvalidToken:
                return Response({'error': 'email validation failed'},
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                user = User.objects.get(username=payload['username'], email=payload['email'])

                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                pass
            serializer = UserSerializer(data=payload)
            if serializer.is_valid():
                user = serializer.save()
                user.email_verified = True
                user.save()
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except ValueError:
            pass
        return Response({'error': 'email validation failed'},
                        status=status.HTTP_400_BAD_REQUEST)


class PasswordResetEmailViewSet(viewsets.ViewSet):
    """
    A viewset for sending an email for reseting the password.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def send_email(self, user: User, reset_url: str) -> None:
        """
        Send the email to the user with the url for reseting the password.
        """
        html_message = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #000;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }}
                    .email-container {{
                        background-color: #ffffff;
                        border: 1px solid #ddd;
                        padding: 20px;
                        margin: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }}
                    h1 {{
                        color: #c1596c;
                    }}
                    p {{
                        font-size: 16px;
                    }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h1>Reset your password</h1>
                    <p>Click here to to reset your password:</p>
                    <a href="{reset_url}"
                    style="background-color: #c1596c; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Confirm
                    </a>
                </div>
            </body>
        </html>
        """
        user.email_user(
            subject='Reset Password',
            message='',
            from_email=settings.EMAIL_HOST_USER,
            html_message=html_message
        )


    def create(self, request: Request) -> Response:
        """
        Send the email to let the user reset the password.
        """
        username = request.data.get('username')
        email = request.data.get('email')
        try:
            user = User.objects.get(username=username, email=email)
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            url =  get_url(request)
            reset_url = (
                url + 'resetPassword'
                f'?uid={uid}&token={token}'
            )
            self.send_email(user, reset_url)
            return Response({
                'message': 'Password reset email sent'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'error': 'No such user with the given credentials'
            }, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordViewSet(viewsets.ViewSet):
    """
    A viewset for reseting the password.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request: Request) -> None:
        """
        This method get the uid and the token from the url. If the uid and
        the token are valid.
        """
        try:
            uid = urlsafe_base64_decode(request.GET.get('uid')).decode()
            token = request.GET.get('token')
            user = User.objects.get(pk=uid)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({
                    'error': 'Invalid token'
                }, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, ValueError):
            return Response({
                'error': 'Invalid request'
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
                    'info': 'You can reset your password'
                }, status=status.HTTP_200_OK)

    def create(self, request: Request) -> None:
        """
        This method get the uid and the token from the url. If the uid and
        the token are valid, a new password will be set for the user.
        """
        try:
            uid = urlsafe_base64_decode(request.data.get('uid')).decode()
            token = request.data.get('token')
            user = User.objects.get(pk=uid)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({
                    'error': 'Invalid token'
                }, status=status.HTTP_400_BAD_REQUEST)
        # urlsafe_base64_decode() might throw a ValueError if the uid is not
        # valid
        except (User.DoesNotExist, ValueError):
            return Response({
                'error': 'Invalid request'
            }, status=status.HTTP_400_BAD_REQUEST)
        new_password = request.data.get('password')
        if not new_password:
            return Response({
                'error': 'Password cannot be empty'
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Password reset successful'
            }, status=status.HTTP_200_OK)
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
        response_data = {}
        data['avatar'] = None
        if 'isRemove' in data:
            if  data['isRemove'] == 'yes': del data['avatar']
            if  data['isRemove'] == 'no' and 'avatar' in request.FILES:
                data['avatar'] = request.FILES['avatar']
        if 'email' in data and data['email'] != user.email:
            if User.objects.filter(email=data['email']).exists():
                return Response({'tmp_email': 'This email is already in use.'},
                status=status.HTTP_400_BAD_REQUEST)
            data['tmp_email'] = data['email']
            del data['email']
            generate_otp_for_user(user)
            try:
                send_otp_to(user, data['tmp_email'])
            except ValueError as e:
                return Response({'tmp_email': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            response_data['message'] = 'the code sent to your email'
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            user.register_complete = True
            user.save()
            serializer.save()
            response_data['data'] = serializer.data
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserPasswordView(APIView):
    """
        update the password
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data.copy()
        if user.has_usable_password():
            required_fields = ['CurrentPassword', 'password', 'confirmPassword']
        else:
            required_fields = [ 'password', 'confirmPassword']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return Response(
                {field: "This field may not be blank." for field in missing_fields},
                status=status.HTTP_400_BAD_REQUEST
            )
        if user.has_usable_password():
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
    def get_block_status(self, user, obj):
        req = FriendRequest.objects.filter(
            Q(sender=user, receiver=obj, status='blocked') |
            Q(sender=obj, receiver=user, status='blocked')
        ).first()
        if (req):
            return "blocker" if user == req.sender else "blocked"
        return False

    def get(self, request, username, format=None):
        """
        Retrieve user data by username.
        """
        from ..friends.serializers import FriendSerializer
        user = get_object_or_404(User, username=username)
        add_level_achievement_to_user(user)
        add_game_achievement_to_user(user)
        add_milestone_achievement_to_user(user)
        serializer = FriendSerializer(user, context={"user": request.user})
        data = serializer.data.copy()
        if data.get('is_blocked'):
            data['is_blocked'] = self.get_block_status(request.user, user)
        return Response(data, status=status.HTTP_200_OK)


class GetIntraLink(APIView):
    """
        get intra link
    """
    permission_classes = [AllowAny]
    authentication_classes = []
    def get(self, request):
        url =  get_url(request, settings.INTRA_REDIRECT_URI)
        data = f'https://api.intra.42.fr/oauth/authorize?client_id={settings.INTRA_ID}&redirect_uri={url}&response_type=code'
        return Response(data, status=status.HTTP_200_OK)


class GetGoogleLink(APIView):
    """
        get google link
    """
    permission_classes = [AllowAny]
    authentication_classes = []
    def get(self, request):
        url =  get_url(request, settings.GOOGLE_REDIRECT_URI)
        data = f'https://accounts.google.com/o/oauth2/v2/auth?client_id={settings.GOOGLE_ID}&scope=openid profile email&response_type=code&display=popup&redirect_uri={url}'
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
        return Response({'message': 'otp send successfaly'}, status=status.HTTP_200_OK)

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            val = user.otp_active
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


class checkValidOtpEmail(APIView):
    """
     This view checks if the OTP entered by th user is valid(in setting)
     to change the email of the user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        otp = request.data['key']
        total_difference = timezone.now() - user.otp_created_at
        if total_difference.total_seconds() > 60 or otp != str(user.otp):
            return Response({'error': 'Key is invalid'},
                            status=status.HTTP_400_BAD_REQUEST)
        user.email = user.tmp_email
        user.tmp_email = None
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
