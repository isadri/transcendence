from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model.
    """
    email = models.EmailField(_('Email'), unique=True)
    avatar = models.ImageField(_('Avatar'), upload_to='avatars', blank=True,
                                null=True,
                                default='default/default_profile.jpg')

    def __str__(self) -> str:
        """
        Return username as a string representation of the object.
        """
        return self.username
