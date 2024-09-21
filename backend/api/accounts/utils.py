from django.conf import settings
import requests
import secrets
import string
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer
from .totp import TOTP


def send_otp_email(user: User) -> None:
    """
    Send an email to the user containg the otp key.
    """
    user.email_user(
        subject='Email verification',
        message=f'Your verification code is: {TOTP().generate(str(user.seed))}',
        from_email='issam.abk01@gmail.com'
    )


def generate_seed() -> str:
    """
    Return a random secret.
    """
    choices = (string.ascii_lowercase + string.ascii_uppercase + string.digits
               + string.punctuation)
    seed = ''.join(secrets.choice(choices) for _ in range(20))
    return seed


def generate_password() -> str:
    """
    Generate and return a password.
    """
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(characters) for _ in range(30))
    return password


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


def get_access_token_from_api(uri: str, payload: dict[str, str]) -> str:
    """
    Obtain the access token by making a post request to the token endpoint.

    Args:
        uri: The token endpoint URI
        payload: A dictionary that must contain the following parameters:
                grant_type, code, redirect_uri and client_id
    """
    response = requests.post(uri, params=payload)
    return response.json().get('access_token')


def create_store_tokens_for_user(user: User, status_code: int) -> Response:
    """
    Create new refresh and access tokens and stores them in the Set-Cookie
    header of the returned response.

    Args:
        user: The user for which the refresh and access tokens will be
        created.
        status_code: The status code of the response.

    Returns:
        A Response object containing the user along with her refresh and
        access tokens.
    """
    refresh_token, access_token = get_tokens_for_user(user)
    response = Response({
        'user': UserSerializer(user).data,
        'refresh_token': refresh_token,
        'access_token': access_token
    }, status=status_code)
    store_token_in_cookies(response, access_token)
    return response


def create_user(username: str, email: str) -> Response:
    """
    Create a user if does not exist.

    This funtion checks if a user exists, otherwise it creates a new one,
    creates a refresh and access tokens for the user and stores the access
    token through Set-Cookie header in the response.

    Args:
        user_info: Dict containing user information for creating or getting a
                user.

    Returns:
        A Response object containing the user, and refresh and access tokens.
    """
    try:
        user = User.objects.get(username=username)
        status_code = status.HTTP_200_OK
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email,
            #password=generate_password(),
            )
        status_code = status.HTTP_201_CREATED
    return create_store_tokens_for_user(user, status_code)


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


def state_match(state: str) -> bool:
    """
    Check if the given state is valid.
    """
    return state == settings.OAUTH2_STATE_PARAMETER
