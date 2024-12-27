import os
from datetime import timedelta
from decouple import config
import dj_database_url
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
]

SITE_ID = 1

# Application definition

INSTALLED_APPS = [
    'api.game',
    'api.chat',
    'api.friends',
    'api.accounts',
    'api.notifications',
    
    'channels',
    'corsheaders',
    
    'allauth',
    'oauth2_provider',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt.token_blacklist',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'oauth2_provider.middleware.OAuth2TokenMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'allauth.account.middleware.AccountMiddleware',
    'django.middleware.locale.LocaleMiddleware',
]

ROOT_URLCONF = 'config.urls'

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': dj_database_url.config()
}

CORS_ALLOW_ALL_ORIGINS = True

APPEND_SLASH = True

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_PRIVATE_NETWORK = True

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 6,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# The custom user model
AUTH_USER_MODEL = 'accounts.User'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Setting authentication scheme
REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.accounts.authentication.TokenAuthentication',
	],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# JWT settings
SIMPLE_JWT = {
	'ACCESS_TOKEN_LIFETIME': timedelta(hours=2400),
	'REFRESH_TOKEN_LIFETIME': timedelta(hours=2400),
    'ROTATE_REFRESH_TOKENS': True,
	'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': config('SIGNING_KEY'),
}

AUTH_COOKIE = 'access_token'

# Sessions settings
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

CSRF_COOKIE_HTTPONLY = True

#LOGIN_REDIRECT_URL = '/'
#LOGOUT_REDIRECT_URL = '/'

EMAIL_BACKEND = config('EMAIL_BACKEND')
EMAIL_HOST = config('EMAIL_HOST')
EMAIL_PORT = config('EMAIL_PORT', cast=int)
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True

#Intra 42
INTRA_ID = config('INTRA_ID')
INTRA_REDIRECT_URI = config('INTRA_REDIRECT_URI')

#Google
GOOGLE_ID = config('GOOGLE_ID')
GOOGLE_REDIRECT_URI = config('GOOGLE_REDIRECT_URI')

ASGI_APPLICATION = "config.asgi.application"

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [("redis", config('REDIS_PORT', default=6379, cast=int))],
        },
    },
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(levelname)s %(message)s %(pathname)s %(lineno)d',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'json',
        },
        'logstash': {
            'level': 'DEBUG',
            'class': 'logstash_async.handler.AsynchronousLogstashHandler',
            'formatter': 'json',
            'transport': 'logstash_async.transport.TcpTransport',
            'host': 'logstash',
            'port': config('LOGSTASH_TCP_PORT', default=5959, cast=int),
            'ssl_enable': True,
            'ssl_verify': True,
            'ca_certs': '/etc/ssl/certs/ca/ca.crt',
            'certfile': '/etc/ssl/certs/backend-server/backend-server.crt',
            'keyfile': '/etc/ssl/certs/backend-server/backend-server.key',
            'database_path': None,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['logstash'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'api.accounts.views': {
            'handlers': ['logstash'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

