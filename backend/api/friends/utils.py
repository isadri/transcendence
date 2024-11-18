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

# from .models import FriendRequest

# def get_friend_request(sender,receiver):
# 	try:
# 		return FriendRequest.objects.get(sender=sender, receiver=receiver, is_active=True)
# 	except FriendRequest.DoesNotExist:
# 		return False