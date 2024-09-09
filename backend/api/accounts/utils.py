from django.conf import settings
import requests
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    """
    Create refresh and access tokens for the given user.
    
    Args:
        user: The user for which the tokens will be created.
    """
    refresh = RefreshToken.for_user(user)
    
    return str(refresh), str(refresh.access_token)


def store_token_in_cookies(response, token) -> None:
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
