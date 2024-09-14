from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def lowercase_username_validator(username):
    if any(c for c in username if c.isupper()):
        raise ValidationError(_(f'username cannot contain upper case letters.'))
