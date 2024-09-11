from django.conf import settings
import requests
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer


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


def same_state(state: str) -> bool:
    return state == settings.OAUTH2_STATE_PARAMETER
