import logging
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token

from .models import User


logger = logging.getLogger(__name__)


class TokenAuthentication(JWTAuthentication):
    """
    Custom authentication scheme.

    This class subclasses JWTAuthentication to custom authentication using
    JWT tokens.
    """

    def authenticate(self, request: Request) -> tuple[User, Token] | None:
        """
        Verify if the request contains a valid JWT token.

        This functions checks if the request contains a JWT token stored in
        the cookies. If it is not stored in the cookies, this function will
        try to get the token from the request header. If the token is found,
        and is valid, the function returns the validated token and the user
        using the given validated token.

        Raises:
            AuthenticationFailed: If the authentication is attempted but fails.

        Returns:
            Two-tuple of (user, token), None if the token is not found or the
            token is not valid or no such user exists with the validated token.
        """
        header = self.get_header(request)
        if header:
            raw_token = self.get_raw_token(header)
        else:
            raw_token = request.COOKIES.get(settings.AUTH_COOKIE)
        if not raw_token:
            logger.error('token does not exist', extra={'index_name': 'errors'})
            return None
        validated_token = self.get_validated_token(raw_token)
        if not validated_token:
            logger.error('token is not valid', extra={'index_name': 'errors'})
            raise AuthenticationFailed
        user = self.get_user(validated_token)
        if not user:
            logger.error('user with invalid token', extra={'index_name': 'errors'})
            raise AuthenticationFailed
        return user, validated_token
