# from django.contrib.auth import get_user_model

# from .models import Friend


# User = get_user_model()


# def get_object(user: User) -> Friend:
#     try:
#         user = Friend.objects.get(user=user)
#     except Friends.DoesNotExist:
#         user = Friend(user=user)
#         user.save()
#     return user