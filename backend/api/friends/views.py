from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import FriendList, FriendRequest
# from .serializers import FriendRequestSenderSerializer
from .serializers import FriendRequestReceiverSerializer, FriendListSerializer
# from ..accounts.serializers import UserSerializer


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
            status=status.HTTP_400_BAD_REQUEST)

        friendShip = FriendRequest.objects.create(sender=request.user, receiver=receiver)
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
           status=status.HTTP_404_NOT_FOUND)
        friend_request.accept()
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
           status=status.HTTP_404_NOT_FOUND)
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
           status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        return Response({'message': 'Friend request cancel.'}, status=status.HTTP_200_OK)

class FriendRequestBlockView(APIView):
    """
    This view is used to block a friend request.
    """
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
                                status=status.HTTP_404_NOT_FOUND)

            # Block the user
            friend_request.block(request.user)
            return Response({'message': 'Friend request blocked.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to block the friend request: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendRequestUnblockView(APIView):
    """
    This view is used to unblock a friend request.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        try:
            # Find the FriendRequest where the user is either sender or receiver
            friend_request = FriendRequest.objects.filter(
                    Q(sender=request.user, receiver_id=pk) |
                    Q(sender_id=pk, receiver=request.user),
                    status='blocked',
                    blocked_by=request.user,
                    ).first()
            print(friend_request)
            if not friend_request:
                return Response({'error': 'No blocked request found.'},
                                status=status.HTTP_404_NOT_FOUND)

            friend_request.unblock(request.user)
            return Response({'message': 'Friend request unblocked.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to unblock the friend request: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PendingFriendRequestsView(generics.ListAPIView):
    """
    View to list all pending friend requests.
    """
    serializer_class = FriendRequestReceiverSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(receiver=self.request.user, status="pending")


class AcceptedFriendRequestsView(generics.ListAPIView):
    """
    View to list all accepted friend requests.
    """
    serializer_class = FriendRequestReceiverSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(receiver=self.request.user, status="accepted")

class BlockedFriendRequestsView(generics.ListAPIView):
    """
    View to list all blocked friend requests.
    """
    serializer_class = FriendRequestReceiverSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(
            Q(receiver=self.request.user) | Q(sender=self.request.user),
            status="blocked"
        )


class FriendListView(generics.ListAPIView):
    """
    View to list all friend.
    """
    serializer_class = FriendListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            friend_list = FriendList.objects.get(user=self.request.user)
            serializer = self.get_serializer(friend_list)
            return Response(serializer.data)
        except FriendList.DoesNotExist:
            return Response({"friends": []})

# class FriendRequestAcceptView(generics.UpdateAPIView):
#     """
#     This view is used to accept friend requests.
#     """
#     serializer_class = FriendRequestAcceptSerializer
#     queryset = FriendRequest.objects.all()
#     permission_classes = [IsAuthenticated]

#     def patch(self, request, *args, **kwargs):
#         try:
#             sender_id = int(request.data['sender'])
#         except ValueError:
#             return Response({'error': 'sender ID must be an integer.'},
#             status=status.HTTP_400_BAD_REQUEST)

#         try:
#             sender = User.objects.get(id=sender_id)
#         except User.DoesNotExist:
#             return Response({'error': 'That user does not exist'},
#             status=status.HTTP_404_NOT_FOUND)

#         try:
#             check_friendShip = FriendRequest.objects.get(sender=sender, receiver=request.user,
#             status='pending')
#             check_friendShip.accept()
#         except FriendRequest.DoesNotExist:
#             return Response({'error': 'No such request'},
#                             status=status.HTTP_404_NOT_FOUND)
#         except FriendRequest.AlreadyExistsError:
#             return Response({'error': 'You are already friends with this user.'},
#             status=status.HTTP_400_BAD_REQUEST)
#         return Response({'message': 'Friend request accepted'},
#                         status=status.HTTP_200_OK)

        # if check_friendShip:
        #     return Response({'error': 'You are already friends with this user.'},
        #     status=status.HTTP_400_BAD_REQUEST)

        # check_friendShip.status = 'accept'

# class FriendRequestAcceptView(generics.CreateAPIView):
#     """
#     This view is used to accept friend requests.

#     """
#     serializer_class = FriendRequestSenderSerializer
#     queryset = FriendRequest.objects.all()

#     def post(self, request: Request) -> Response:
#         """
#         Accept the friend request.

#         Returns:
#             HTTP_404_NOT_FOUND response: If there is no friend request to the
#                 current user.
#             HTTP_400_BAD_REQUEST response: If the current user and the sender
#                 user are already friends.
#             HTTP_200_OK response: If the current user accept the friend request
#                 of the sender user.
#         """
#         sender_id = request.data['sender']
#         sender = User.objects.get(id=sender_id)
#         try:
#             friend_request = FriendRequest.objects.get(sender=sender,
#                                                        receiver=request.user)
#             friend_request.accept()
#         except FriendRequest.DoesNotExist:
#             return Response({'error': 'No such request'},
#                             status=status.HTTP_404_NOT_FOUND)
#         except friends.AlreadyExistsError:
#             return Response({'error': 'This user is already a friend.'},
#                             status=status.HTTP_400_BAD_REQUEST)
#         return Response({'message': 'friend request accepted'},
#                         status=status.HTTP_200_OK)



# class FriendRequestSendView(generics.CreateAPIView):
#     """
#     This view is used to send friend requests.
#     """
#     serializer_class = FriendRequestReceiverSerializer
#     queryset = FriendRequest.objects.all()
#     permission_classes = [IsAuthenticated]

#     def post(self, request: Request) -> Response:
#         """
#         Send a friend request.
#         """
#         # receiver_id = request.data['receiver']

#         try:
#             receiver_id = int(request.data['receiver'])
#         except ValueError:
#             return Response({'error': 'Receiver ID must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

#         if request.user.id == receiver_id:
#             return Response({'error': 'You cannot send a friend request to yourself.'},
#                 status=status.HTTP_400_BAD_REQUEST)

#         try:
#             receiver = User.objects.get(id=receiver_id)
#         except User.DoesNotExist:
#             return Response({'error': 'User does not exist.'},
#                             status=status.HTTP_404_NOT_FOUND)

#         # Check if already friends
#         if FriendList.objects.filter(user=request.user, friends=receiver).exists():
#             return Response({'error': 'You are already friends with this user.'},
#                             status=status.HTTP_400_BAD_REQUEST)

#         _, created = FriendRequest.objects.get_or_create(sender=request.user,
#                                                          receiver=receiver)
#         if created:
#             return Response({'message': 'the request is sent.'},
#                             status=status.HTTP_201_CREATED)
#         else:
#             return Response({'error': 'the request is already sent.'},
#                             status=status.HTTP_400_BAD_REQUEST)


# class FriendRequestList(generics.ListAPIView):
#     """
#     List all friend request 
#     """
    



# class FriendAddView(APIView):
#     """
#     This view is used to add a new friend.
#     """

#     def post(self, request: Request) -> Response:
#         """
#         Add a new friend.
#         """
#         try:
#             username = request.data.get('username', '')
#             new_friend = User.objects.get(username=username)
#         except User.DoesNotExist:
#             return Response({'error': 'No such user.'},
#                             status=status.HTTP_404_NOT_FOUND)
#         friend_list = FriendList.objects.get(user=request.user)
#         try:
#             friend_list.add(new_friend)
#         except friends.AlreadyExistsError:
#             return Response({'error': 'This friend already exists.'},
#                             status=status.HTTP_400_BAD_REQUEST)
#         friends_list = [item.username for item in friend_list.friends.all()]
#         return Response({'friends': friends_list}, status=status.HTTP_200_OK)


# class FriendListView(APIView):
#     """
#     This view list all friends of the current user.
#     """

#     def get(self, request: Request) -> Response:
#         """
#         List all the friends of the current user.
#         """
#         user = FriendList.objects.get(user=request.user)
#         queryset = user.friends.all()
#         serializer = UserSerializer(queryset, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)