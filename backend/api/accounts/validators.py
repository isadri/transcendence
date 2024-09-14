from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def lowercase_username_validator(username: str) -> str:
    """
    Raise ValidationError if username contains upper case letters.
    """
    if any(c for c in username if c.isupper()):
        raise ValidationError(_('username cannot contain upper case letters.'))
