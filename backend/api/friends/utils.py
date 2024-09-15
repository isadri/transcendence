from django.contrib.auth import get_user_model

from .models import Friends


User = get_user_model()


def get_object(user: User) -> Friends:
    try:
        user = Friends.objects.get(user=user)
    except Friends.DoesNotExist:
        user = Friends(user=user)
        user.save()
    return user
