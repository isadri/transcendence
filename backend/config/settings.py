import os
import time
from datetime import timedelta
from pathlib import Path


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&llk^3rmodi5^_#c+#w(&vb_ro^-=)u*@&3p9#d4+cwkcwy$)w'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# The initial time used for generating TOTP values
INITIAL_TIME = time.time()

ALLOWED_HOSTS = ['*']

SITE_ID = 2

# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

	'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

	'rest_framework_simplejwt.token_blacklist',

	'api.accounts',
	'api.friends',

    'oauth2_provider',

    'api.chat',
	'api.notifications',
    'channels',
]

#SOCIALACCOUNT_PROVIDERS = {
#	'google': {
#		'SCOPE': [
#			'profile',
#			'email'
#		],
#		'AUTH_PARAMS' : {'access_type': 'online'}
#	}
#}

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

#STATIC_URL = '/static/'
MEDIA_URL = '/media/'

#STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
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
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
		'NAME': os.getenv('POSTGRES_DB'),
		'USER': os.getenv('POSTGRES_USER'),
		'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
		'HOST': 'postgres',
		'PORT': '5432',
    }
}

CORS_ALLOW_ALL_ORIGINS = True

APPEND_SLASH = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5000",
    "http://e2r10p14:5000",
    "http://0.0.0.0:5000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:8000",
]


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
	#'oauth2_provider.backends.OAuth2Backend',
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
    'SIGNING_KEY': '021AA___qq02passkey-',
}

AUTH_COOKIE = 'access_token'

# Sessions settings
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# Now client-side JavaScript will not be able to access the CSRF cookie.
CSRF_COOKIE_HTTPONLY = True

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

#LOGIN_URL = 'two_factor:login'

OAUTH2_STATE_PARAMETER='rU_k-YeqC1jOfMa4Yk_f4h7uAzSKH7zKjAA6wVNBSt8'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = '587'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True


#Intra 42
INTRA_ID = os.getenv('INTRA_ID')
INTRA_REDIRECT_URI = os.getenv('INTRA_REDIRECT_URI')

#Google
GOOGLE_ID = os.getenv('GOOGLE_ID')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')

ASGI_APPLICATION = "config.asgi.application"

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [("redis", 6379)],
        },
    },
}