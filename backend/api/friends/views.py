from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import FriendList, FriendRequest
from .serializers import FriendRequestReceiverSerializer, FriendListSerializer

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
