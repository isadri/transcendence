from config.settings import AUTH_PASSWORD_VALIDATORS
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import FriendList, FriendRequest
from ..chat.models import Chat
from .serializers import FriendRequestReceiverSerializer, FriendListSerializer, FriendSerializer, FriendRequestUnblockSerializer
from django.shortcuts import get_object_or_404

from api.notifications.consumers import NotificationConsumer

User = get_user_model()

class FriendRequestSendView(generics.CreateAPIView):
    """
    This view is used to send friend requests.
    """
    serializer_class = FriendRequestReceiverSerializer
    queryset = FriendRequest.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            receiver_id = int(request.data['receiver'])
        except ValueError:
            return Response({'error': 'Receiver ID must be an integer.'},
            status=status.HTTP_400_BAD_REQUEST)

        if request.user.id == receiver_id:
            return Response({'error': 'You cannot send a friend request to yourself.'},
            status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'That user does not exist'},
            status=status.HTTP_404_NOT_FOUND)

        check_friendShip = FriendRequest.objects.filter(sender=request.user,
        receiver=receiver, status__in=['pending', 'accepted', 'blocked']).first() \
        or FriendRequest.objects.filter(sender=receiver, 
        receiver=request.user, status__in=['pending', 'accepted', 'blocked']).first()
        if check_friendShip:
            return Response({'error': 'A friend request already exists between you and this user.'},
            status=status.HTTP_201_CREATED)

        friendShip = FriendRequest.objects.create(sender=request.user, receiver=receiver)
        message = f"You have a new friend request from {request.user.username}!"
        NotificationConsumer.send_friend_request_notification(receiver.id, message, "Friend Request")
        return Response({'message': 'Friend request send successfuly.'},
        status=status.HTTP_201_CREATED)

class FriendRequestAcceptView(APIView):
    """
    This view is used to accept friend requests.
    """
    # serializer_class = FriendRequestAcceptSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        try:
            friend_request = FriendRequest.objects.get(sender=pk, receiver=request.user, status='pending')
        except FriendRequest.DoesNotExist:
           return Response({'error': 'Friend request not found or already processed.'},
           status=status.HTTP_200_OK)
        friend_request.accept()
        message = f"Your friend request was accepted by {request.user.username}!"
        NotificationConsumer.send_friend_request_notification(pk, message, "Accepted")
        return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)


class FriendRequestDeclineView(APIView):
    """
    This view is used to decline friend request
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk: int):
        try:
            friend_request = FriendRequest.objects.get(sender=pk, receiver=request.user, status='pending')
        except FriendRequest.DoesNotExist:
           return Response({'error': 'Friend request not found or already processed.'},
           status=status.HTTP_200_OK)
        friend_request.delete()
        return Response({'message': 'Friend request declined.'}, status=status.HTTP_200_OK)


class FriendRequestCancelView(APIView):
    """
    This view is used to cancel friend request
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk: int):
        try:
            friend_request = FriendRequest.objects.get(sender=request.user, receiver=pk, status='pending')
        except FriendRequest.DoesNotExist:
           return Response({'error': 'Friend request not found or already processed.'},
           status=status.HTTP_200_OK)
        friend_request.delete()
        return Response({'message': 'Friend request cancel.'}, status=status.HTTP_200_OK)


class FriendRequestBlockView(APIView):
    """
    This view is used to block a friend request.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        try:
            try:
                receiver = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'},
                        status=status.HTTP_404_NOT_FOUND)
            # chat, _ = Chat.objects.get_or_create(
            #     Q(user1=request.user, user2=receiver) |
            #     Q(user1=receiver, user2=request.user),
            #     # defaults={'blocke_state_user1': 'none', 'blocke_state_user2': 'none'}
            # )
            chat = Chat.objects.filter(
                Q(user1=request.user, user2=receiver) |
                Q(user1=receiver, user2=request.user)
            ).first()  # Fetch the first match asynchronously

            if not chat:
                chat = Chat.objects.create(
                    user1=request.user,
                    user2=receiver
                )
            if request.user == chat.user1:
                chat.blocke_state_user1 = "blocked"
                chat.blocke_state_user2 = "blocker"
            else:
                chat.blocke_state_user1 = "blocker"
                chat.blocke_state_user2 = "blocked"
            chat.save()

            friend_request = FriendRequest.objects.filter(
                Q(sender=request.user, receiver_id=pk) |
                Q(sender_id=pk, receiver=request.user),
                # status='accepted'
            ).first()
            if friend_request:
                if friend_request.status == 'blocked':
                    return Response({'error': 'You can not block this user.'}, status=status.HTTP_200_OK)
                friend_request.block(request.user)
            else:
                FriendRequest.objects.create(
                    sender=request.user,
                    receiver=receiver,
                    status='blocked',
                    blocked_by=request.user
                )
            # Block the user
            return Response({'message': 'User blocked successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to block the friend request: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendRequestRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        try:
            # Find the FriendRequest where the user is either sender or receiver
            friend_request = FriendRequest.objects.filter(
                Q(sender=request.user, receiver_id=pk) |
                Q(sender_id=pk, receiver=request.user),
                status='accepted'
            ).first()

            if not friend_request:
                return Response({'error': 'Friend request not found or already processed.'},
                                status=status.HTTP_200_OK)

            friend_request.remove(request.user)
            # friend_request.delete()
            return Response({'message': 'Remove friend and delete the request.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to remove the friend request: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


class FriendRequestUnblockView(APIView):
    """
    This view is used to unblock a friend request.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        try:
            try:
                receiver = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'},
                        status=status.HTTP_404_NOT_FOUND)

            # chat, _ = Chat.objects.get_or_create(
            #     Q(user1=request.user, user2=receiver) |
            #     Q(user1=receiver, user2=request.user),
            # )
            chat = Chat.objects.filter(
                Q(user1=request.user, user2=receiver) |
                Q(user1=receiver, user2=request.user)
            ).first()  # Fetch the first match asynchronously

            if not chat:
                chat = Chat.objects.create(
                    user1=request.user,
                    user2=receiver
            )
            if request.user == chat.user1:
                chat.blocke_state_user1 = "none"
                chat.blocke_state_user2 = "none"
            else:
                chat.blocke_state_user1 = "none"
                chat.blocke_state_user2 = "none"
            chat.save()

            friend_request = FriendRequest.objects.filter(
                    Q(sender=request.user, receiver_id=pk) |
                    Q(sender_id=pk, receiver=request.user),
                    status='blocked',
                    blocked_by=request.user,
                    ).first()
            if not friend_request:
                return Response({'error': 'No blocked request found.'},
                                status=status.HTTP_200_OK)

            friend_request.unblock(request.user)
            friend_request.delete()
            return Response({'message': 'Friend request unblocked.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to unblock the friend request: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PendingFriendRequestsView(APIView):
    """
    View to list all pending friend requests.
    """
    # serializer_class = FriendRequestReceiverSerializer
    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        # Get pending friend requests for the authenticated user
        pending_requests = FriendRequest.objects.filter(receiver=request.user, status="pending")
        # Serialize the data
        serializer = FriendRequestReceiverSerializer(pending_requests, many=True, context={'user': request.user})
        # Return the response
        return Response(serializer.data, status=status.HTTP_200_OK)

class CancelFriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Get all users to whom the current user has sent pending friend requests.
        """
        # Filter FriendRequests where current user is the sender and status is pending
        try:
            pending_requests = FriendRequest.objects.filter(
                sender=request.user, status="pending"
            ).select_related("receiver")  # Optimize query for receiver

            # Extract only the `receiver` users
            receivers = [request.receiver for request in pending_requests]

            serializer = FriendSerializer(
                    receivers, many=True, context={"user": request.user}
                )

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log and return an error response
            return Response(
                {"error": "An unexpected error occurred.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class AcceptedFriendRequestsView(APIView):
    """
    View to list all accepted friend requests.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        accepted_requests = FriendRequest.objects.filter(receiver=self.request.user, status="accepted")
        serializer = FriendRequestReceiverSerializer(accepted_requests, many=True, context={'user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlockedFriendsRequestsView(APIView):
    """
    View to list all blocked friend requests.
    """
    serializer_class = FriendRequestUnblockSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        blocked_requests = FriendRequest.objects.filter(
            status="blocked",
            blocked_by=self.request.user
        )
        serializer = FriendRequestUnblockSerializer(blocked_requests, many=True, context={'user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlockedFriendRequestsView(APIView):
    """
    This view checks if the given user is blocked by the current user
    or has blocked the current user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # Ensure the specified user exists
            try:
                target_user = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Check blocked status
            blocked_request = FriendRequest.objects.filter(
                Q(sender=request.user, receiver=target_user, status='blocked') |  # User blocked target
                Q(sender=target_user, receiver=request.user, status='blocked')   # Target blocked user
            ).first()

            if not blocked_request:
                return Response({'status': False}, status=status.HTTP_200_OK)
            blocker = blocked_request.blocked_by.id
            blocked = pk if blocker != pk else request.user.id
            return Response({
                'status': True,
                'blocked': blocked,
                'blocker': blocker
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to check blocked status: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FriendListView(generics.ListAPIView):
    """
    View to list all friend.
    """
    serializer_class = FriendListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            friend_list = FriendList.objects.get(user=request.user)
            serializer = FriendListSerializer(friend_list, context={'user' : request.user})
            return Response(serializer.data)
        except FriendList.DoesNotExist:
            return Response({"friends": []})


# class UserListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # friends_ids = FriendRequest.objects.filter(
#         #     Q(sender=request.user, status__in=['accepted', "blocked"]) |
#         #     Q(receiver=request.user, status__in=['accepted', 'blocked'])
#         # ).values_list('sender_id', 'receiver_id')
#         # friends_ids = FriendRequest.objects.filter(
#         #     Q(sender=request.user, status__in=['accepted', 'pending', "blocked"]) |
#         #     Q(receiver=request.user, status__in=['accepted', 'pending', 'blocked'])
#         # ).values_list('sender_id', 'receiver_id')

#         # # Flatten the list of friend IDs
#         # friends_ids = {friend_id for pair in friends_ids for friend_id in pair}

#         # # Add the current user's ID to exclude them as well
#         # friends_ids.add(request.user.id)

#         # # Get all users who are not in the friends list
#         # non_friends = User.objects.exclude(id__in=friends_ids)
        
#         users = User.objects.exclude(id=request.user.id)

#         # Serialize and return the data
#         serializer = FriendSerializer(users, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the IDs of users who have blocked the current user and who have been blocked by the current user
        blocked_users = FriendRequest.objects.filter(
            Q(sender=request.user, status='blocked') | Q(receiver=request.user, status='blocked')
        ).values_list('sender_id', 'receiver_id')

        # Flatten the list of blocked user IDs and remove the current user from the exclusion list
        blocked_users_ids = {user_id for pair in blocked_users for user_id in pair}
        blocked_users_ids.discard(request.user.id)  # Make sure the current user isn't excluded

        # Get the list of users excluding the current user and any blocked users
        users = User.objects.exclude(id=request.user.id).exclude(id__in=blocked_users_ids)

        # Pass the request context to the serializer
        serializer = FriendSerializer(users, many=True, context={'user': request.user})

        # Serialize and return the data
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserListUnfriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = FriendRequest.objects.filter(
            Q(sender=request.user, status__in=['accepted', 'pending', "blocked"]) |
            Q(receiver=request.user, status__in=['accepted', 'pending', "blocked"])
        ).values_list('sender_id', 'receiver_id')

        # Flatten the list of blocked user IDs and remove the current user from the exclusion list
        users_ids = {user_id for pair in users for user_id in pair}
        users_ids.discard(request.user.id)  # Make sure the current user isn't excluded

        # Get the list of users excluding the current user and any blocked users
        users = User.objects.exclude(id=request.user.id).exclude(id__in=users_ids)

        # Pass the request context to the serializer
        serializer = FriendSerializer(users, many=True, context={'user': request.user})

        # Serialize and return the data
        return Response(serializer.data, status=status.HTTP_200_OK)


class FriendshipStatusView(APIView):
    """
    View to check the friendship status between the authenticated user and another user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk: int):
        """
        Return the status between the authenticated user and the user with the given ID (pk).
        """
        try:
            friend_request = FriendRequest.objects.filter(
                (Q(sender=request.user, receiver_id=pk) | Q(sender_id=pk, receiver=request.user))
            ).first()

            if not friend_request:
                return Response({'status': 'no_request'}, status=status.HTTP_200_OK)

            return Response({'status': friend_request.status}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error retrieving friendship status: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MutualFriendsView(generics.ListAPIView):
    """
    View to get mutual friends between the authenticated user and a specific user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        authenticated_user = request.user
        specific_user = get_object_or_404(User, username=username)

        try:
            authenticated_user_friends = FriendList.objects.get(user=authenticated_user).friends.all()
            specific_user_friends = FriendList.objects.get(user=specific_user).friends.all()

            mutual_friends = authenticated_user_friends.filter(id__in=specific_user_friends)
            serializer = FriendSerializer(mutual_friends, many=True)

            return Response(serializer.data, status=200)
        except FriendList.DoesNotExist:
            return Response([], status=200)


class UserRankListlView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = User.objects.exclude(id=request.user.id)
        serializer = FriendSerializer(users, many=True, context={'user': request.user})
        sorted_data = sorted(serializer.data, key=lambda x: x.get('stats', {}).get('level', 0), reverse=True)
        return Response(sorted_data, status=status.HTTP_200_OK)

