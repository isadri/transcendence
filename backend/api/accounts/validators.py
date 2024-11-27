import string
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def username_validator(username: str) -> str:
    """
    Raise ValidationError if username contains invalid character.
    """
    if not username[0].islower() and username[0] != '_':
        raise ValidationError('username can begin with a lowercase '
                              'character or _ only.')
    if len(username) < 4:
        raise ValidationError('username must at least contain 4 characters.')
    allowed_characters = string.ascii_lowercase + string.digits + '_' + '-' + '.'
    if any(c for c in username if c not in allowed_characters):
        raise ValidationError('username can only contain lowercase character'
                              ', digits, ., _, or -.')
