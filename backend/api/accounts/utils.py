import io
import pyotp
import os
import requests
import string
from django.conf import settings
from django.core.files.base import File
from django.db import connection
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


def get_next_id() -> int:
    """
    Get the next last id of the user table.
    """
    with connection.cursor() as cursor:
        cursor.execute("SELECT nextval(pg_get_serial_sequence('accounts_user', 'id'))")
        next_id = cursor.fetchone()[0]
    return next_id + 1


def get_user_token_data(request) -> dict:
    """
    Gets current user data stored on access token

    Args:
        request: the request to get the cookies
    Return:
        returns a dict of user data, example :
        {
            "token_type": string,
            "exp": number,
            "iat": number,
            "jti": string,
            "user_id": number
        }
    """
    try:
        token = request.COOKIES.get(settings.AUTH_COOKIE)
        if not token:
            raise AuthenticationFailed("Authentication credentials were not provided.")
        token_decoder = TokenBackend(
            algorithm=settings.SIMPLE_JWT['ALGORITHM'],
            signing_key=settings.SIMPLE_JWT['SIGNING_KEY']
        )
        return (token_decoder.decode(token, verify=True))
    except Exception as e:
        raise AuthenticationFailed(e)


def get_current_user_id(request) -> int:
    """
    Gets current user id from access token

    Args:
        request: the request to get the cookies
    """
    data = get_user_token_data(request)
    if not data or not data['user_id']:
        raise AuthenticationFailed("Something went wrong.")
    return data['user_id']


def send_otp_email(user: User) -> None:
    """
    Send an email to the user containg the otp key.
    """
    user.email_user(
        subject='Email verification',
        message=('Your verification code is: '
                 f'{str(user.otp)}'),
        from_email='issam.abk01@gmail.com'
    )


def get_tokens_for_user(user: User) -> tuple[str, str]:
    """
    Create refresh and access tokens for the given user.

    Args:
        user: The user for which the tokens will be created.
    """
    refresh = RefreshToken.for_user(user)

    return (str(refresh), str(refresh.access_token))


def store_token_in_cookies(response: Response, token: str) -> None:
    """
    Store the given token through Set-Cookie HTTP header.

    Args:
        response: The response that the token will be set in.
        token: The token that will be send through the response.
    """
    response.set_cookie(
        settings.AUTH_COOKIE,
        value=token,
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        samesite=settings.SESSION_COOKIE_SAMESITE
    )


def get_access_token_from_api(token_endpoint: str,
                              payload: dict[str, str]) -> str:
    """
    Obtain the access token by making a post request to the token endpoint.

    Args:
        token_endpoint: The token endpoint.
        payload: A dictionary that must contain the following parameters:
                grant_type, code, redirect_uri and client_id.
    """
    response = requests.post(token_endpoint, params=payload)
    return response.json().get('access_token')


def set_avatar(user: User, avatar_url: str) -> None:
    """
    Get the avatar if available and set it to the user.
    """
    response = requests.get(avatar_url)
    if response.status_code == 200:
        image_content = io.BytesIO(response.content)
        image_name = os.path.basename(avatar_url)
        user.avatar.save(image_name, File(image_content))
        user.save()


def create_user(username: str, email: str) -> User:
    """
    Create a user.

    This funtion checks if a user exists, otherwise it creates a new one.
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email,
        )
    user.seed = pyotp.random_base32()
    user.otp = pyotp.TOTP(str(user.seed)).now()
    user.otp_created_at = timezone.now()
    user.save()
    return user

def check_username_policy(value: str):
    """
    Check username Policy
        - Length 3 - 15
        - a-z/0-9/-_.
        - first char chold be a-z/_
    """
    if not value[0] in string.ascii_lowercase and value[0] != '_':
        raise ValueError('The username must begin with  a lowercase character or a _.')
    if len(value) < 3 or len(value) > 15:
        raise ValueError('username must at least contain 3 and at most 15 characters.')
    allowed_characters = string.ascii_lowercase + string.digits + '_' + '-' + '.'
    if any(c for c in value if c not in allowed_characters):
        raise ValueError("The username can only contain lowercase characters, digits, '.', '_', or '-'.")


def invalid_username(username: str):
    """
    Check if username policy wrong
    """
    try:
        check_username_policy(username)
    except ValueError:
        return True
    return False


def user_exists(username: str) -> bool:
    """
    Return True if a user with username exists, False otherwise.
    """
    return User.objects.filter(username=username).exists()


def get_user(data: dict) -> User | None:
    """
    This function checks if a user exists with the remote_id that is unique for
    each user authenticated from 42 or Google, if a user is found, return her.
    Otherwise, if a user exists with the given email then this user cannot
    logs in since the email is already taken. If none of the previous is true,
    then this function checks if a user with the given username is already
    exist or if the username does not respect the username policy, and if one
    or both the conditions are True, this function creates a new username and
    sets the register_complete flag to False indicating that this user needs to
    set a new valid username for herself.

    If none of the conditions above is satisfied, then the function just
    creates a new user with the given data.

    Return:
        A user with the given data.
    """
    remote_id = data.get('remote_id')
    username = data.get('username')
    email = data.get('email')
    try:
        user = User.objects.get(remote_id=remote_id)
    except User.DoesNotExist:
        try:
            user = User.objects.get(email=email)

            return None
        except User.DoesNotExist:
            register_state = True
            if user_exists(username) or invalid_username(username):
                username += '*' + str(get_next_id())
                register_state = False
            user = User.objects.create_user(
                remote_id=remote_id,
                username=username,
                email=email,
                register_complete=register_state
            )
            set_avatar(user, data.get('avatar_url'))
    return user


def get_user_info(userinfo_endpoint: str, access_token: str) -> dict[str, str]:
    """
    Get user information.

    This function requests the user information from the api using endpoint by
    the access token to the api in an HTTP Authorization request header. This
    user information include username, first name, last name, and email, etc.

    Returns:
        User information as json.
    """
    header = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(userinfo_endpoint, headers=header)
    return response.json(), response.status_code


def get_access_token_google(authorization_code: str) -> str:
    """
    Get the access token from Google API.

    This function makes a request to Google API to get the access token that
    will be used to get user information. The request contains
    authorization_code which is necessary to authenticate with the API.

    Returns:
        The access token.
    """
    token_endpoint = 'https://oauth2.googleapis.com/token'
    payload = {
        'code': authorization_code,
        'client_id': os.getenv('GOOGLE_ID'),
        'client_secret': os.getenv('GOOGLE_SECRET'),
        'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI'),
        'grant_type': 'authorization_code'
    }
    return get_access_token_from_api(token_endpoint, payload)


def get_access_token_42(authorization_code: str) -> str:
    """
    Get the access token from 42 API.

    This function makes a request to 42 API to get the access token that
    will be used to get user information. The request contains
    authorization_code which is necessary to authenticate with the API.

    Returns:
        The access token.
    """
    token_endpoint = 'https://api.intra.42.fr/oauth/token/'
    payload = {
        'code': authorization_code,
        'client_id': os.getenv('INTRA_ID'),
        'client_secret': os.getenv('INTRA_SECRET'),
        'redirect_uri': os.getenv('INTRA_REDIRECT_URI'),
        'grant_type': 'authorization_code'
    }
    return get_access_token_from_api(token_endpoint, payload)


def get_response(info:dict, status_code: int) -> Response:
    """
    return a response with the data passed by dict and the status code.
    """
    return Response(info, status=status_code)


def is_another_user(user: User, email: str) -> bool:
    """
    This function is used when a user tried to login with 42 intra or Google.

    If the user has an email does not match the given email, then this user
    has another account and should set a new username for this account. If the
    user has an email that matches the given email, then she will logging
    directly without setting a new username, since she is the owner of the
    email.

    Returns:
        True if the emails do not match, False otherwise.
    """
    return user.email != email


def generate_otp_for_user(user: User) -> None:
    """
    Generate a new otp for the given user.
    """
    user.seed = pyotp.random_base32()
    user.code = f"{user.id}_{pyotp.random_base32()}"
    user.otp = pyotp.TOTP(user.seed).now()
    user.otp_created_at = timezone.now()
    user.save()


def reset_code(user: User):
    user.code = None
    user.save()


def validate_token(uid: str, token: str) -> User | None:
    """
    Return the user that has the given token. Return
    None if no such user exists.
    """
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return None
    return user if user.email_verification_token == token else None


def check_otp_key(otp: str, user: User) -> bool:
    """
    Checks if the given otp is valid.
    """
    total_difference = timezone.now() - user.otp_created_at
    if total_difference.total_seconds() > 60 or otp != str(user.otp):
        return False
    return True

