# middleware/socket_middleware.py
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from api.accounts.models import User
from api.accounts.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token
from . import settings

class SocketAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to authenticate WebSocket connections using access token.
    """

    async def __call__(self, scope, receive, send):
        headers = scope.get("headers", {})
        access_token = None
        for i in headers:
            key, val = i
            key, val = key.decode('utf-8'), val.decode('utf-8')
            if key == 'cookie':
                cookies = val.split(";")
                for cookie in cookies:
                    cookie = cookie.strip().split("=")
                    if len(cookie) == 2:
                        name, value = (cookie[0], cookie[1])
                        if name == settings.AUTH_COOKIE:
                            access_token = value
                            break
        auth = await self.get_user(access_token)
        if auth:
            user, token = auth
            scope['user'] = user
            scope['token'] = token
        else:
            scope['user'] = None
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, access_token)->  tuple[User, Token] | None:
        try:
            authenticator = TokenAuthentication()
            user, token = authenticator.socket_authenticate(access_token)
            return (user, token)
        except:
            return None
