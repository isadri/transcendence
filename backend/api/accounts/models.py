from typing import Optional
import uuid
from django.apps import apps
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.contrib.postgres.fields import ArrayField
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# from ..friends.models import Friend


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

        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.password = make_password(password)
        user.save()
        # new_list = Friend(user=user)
        # new_list.save()
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

    username_validators = [ASCIIUsernameValidator()]

    username = models.CharField(
        max_length=150,
        unique=True,
        validators=username_validators,
        help_text=_('Required. 150 characters or fewer. Lower case letters, '
                    'digits, and @/./+/-/_ only.'),
        error_messages={
            'unique': _('A user with that username already exists.'),
        }
    )
    email = models.EmailField(
        unique=True,
        error_messages={
            'unique': _('A user with that email address already exists.')
        }
    )
    avatar = models.ImageField(
        help_text=_('The profile picture'),
        upload_to='avatars',
        default='default.jpeg'
    )
    is_staff = models.BooleanField(
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'
        )
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_(
            'Designates whether this user model should be treated as active.'
            ' Unselect this instead of deleting accounts.'
        )
    )
    date_joined = models.DateTimeField(default=timezone.now)
    code = models.CharField(max_length=70, blank=True, null=True) # for OTP verfiy request
    seed = models.CharField(max_length=40, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    remote_id = ArrayField(
        models.CharField(max_length=100, blank=True, null=True, default="",
            help_text=_('A unique Id for remote accounts (42 / google)'
        )),
        blank=True,             # Allow the field to be empty
        default=list,
        help_text=_(
            'array of A unique Id for remote accounts (42 / google ) to link both google and intra'
        )
    )

    otp_active =models.BooleanField(
        default=False,
        help_text=_(
            '2FA active or not'
        )
    )
    is_online = models.BooleanField(
        default=False,
        help_text=_(
            'the user online or not'
        )
    )

    tmp_email = models.EmailField(blank=True, null=True)

    active_chat = models.IntegerField(default=-1)
    open_chat = models.BooleanField(default=False)

    register_complete = models.BooleanField(default=True)
    from_remote_api = models.BooleanField(default=False)

    email_verification_token = models.CharField(max_length=100, default='')

    email_verified = models.BooleanField(default=False)

    reset_password_token = models.CharField(max_length=128, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def email_user(self, subject, message, from_email=None, **kwargs) -> None:
        """
        Send an email to this user.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def email_user_to_email(self, subject, message, from_email=None, to_email=None, **kwargs) -> None:
        """
        Send an email to this user to a customized email.
        """
        send_mail(subject, message, from_email, [to_email], **kwargs)


    def __str__(self):
        return self.username
