from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class TokenAuthentication(JWTAuthentication):
    """
    Custom authentication scheme.

    This class subclasses JWTAuthentication to custom authentication using
    JWT tokens.
    """

    def authenticate(self, request):
        """
        Verify if the request contains a valid JWT token

        This functions checks if the request contains a JWT token stored in
        the cookies, and if this token is found, and it is valid, the function
        returns the validated token and the user using the given validated
        token.
        """
        header = self.get_header(request)
        if header:
            raw_token = self.get_raw_token(header)
        else:
            raw_token = request.COOKIES.get(settings.AUTH_COOKIE)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        if not validated_token:
            raise AuthenticationFailed
        user = self.get_user(validated_token)
        if not user:
            raise AuthenticationFailed
        return user, validated_token
