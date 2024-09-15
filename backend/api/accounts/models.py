from typing import Optional
from django.apps import apps
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .validators import lowercase_username_validator
from ..friends.models import Friends


class UserManager(BaseUserManager):
    """
    Custom user manager.
    """
    def create_user(self, username: str, email: str,
                    password: Optional[str] = None, **extra_fields) -> 'User':
        """
        Create and save a user with the given username, email, password and
        extra_fields.

        Raises:
            ValueError: If the username or the email were not given.

        Returns:
            A new user.
        """
        if not username:
            raise ValueError('The username must be given')
        if not email:
            raise ValueError('The email must be given')
        email = self.normalize_email(email)

        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        username = GlobalUserModel.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.password = make_password(password)
        user.save()
        new_list = Friends(user=user)
        new_list.save()
        return user

    def create_superuser(self, username: str, email: str,
                         password: Optional[str] = None,
                         **extra_fields) -> 'User':
        """
        Create a superuser.

        Returns:
            A new superuser.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_active=True.')
        return self.create_user(username, email, password, **extra_fields)


class User(PermissionsMixin, AbstractBaseUser):
    """
    Custom user model.
    """
    username_validators = [
        ASCIIUsernameValidator(), lowercase_username_validator
    ]

    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        validators=username_validators,
        help_text=_('Required. 150 characters or fewer. Lower case letters, '
                    'digits, and @/./+/-/_ only.'),
        error_messages={
            'unique': _('A user with that username already exists.'),
        }
    )
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _('A user with that email address already exists.')
        }
    )
    avatar = models.ImageField(
        _('avatar'),
        help_text=_('The profile picture'),
        upload_to='avatars',
        default='default.jpg'
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'
        )
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user model should be treated as active.'
            ' Unselect this instead of deleting accounts.'
        )
    )
    date_joined = models.DateTimeField(_('date joined'),
                                       default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def clean(self) -> None:
        """
        Normalize the username and the email.
        """
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self) -> str:
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = f'{self.first_name} {self.last_name}'
        return full_name

    def get_short_name(self) -> str:
        """
        Return the short name for the user.
        """
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs) -> None:
        """
        Send an email to this user.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)
