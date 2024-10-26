from django.conf import settings
import pyotp
import os
import requests
from django.utils import timezone
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


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


def get_user(username: str, email: str) -> User:
    """
    Get a user.

    This funtion checks if a user exists, otherwise it creates a new one.
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email
        )
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


def state_match(state: str) -> bool:
    """
    Check if the given state is valid.
    """
    return state == settings.OAUTH2_STATE_PARAMETER


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
    token_endpoint = 'https://api.intra.42.fr/token'
    payload = {
        'code': authorization_code,
        'client_id': os.getenv('INTRA_ID'),
        'client_secret': os.getenv('INTRA_SECRET'),
        'redirect_uri': os.getenv('INTRA_REDIRECT_URI'),
        'grant_type': 'authorization_code'
    }
    return get_access_token_from_api(token_endpoint, payload)
