from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth import get_user_model

from .models import GameInvite, Game
from .serializers import GameInviteSerializer

from rest_framework import status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

NO_INV_NO_ACCESS = {'error' : 'You dont have access or the invite does not exists'}


class CreateGameInvite(APIView):
  serializer_class = GameInviteSerializer
  permission_classes = [IsAuthenticated]

  def post(self, request):
    inviter = request.user
    print(request.data.get('invited'))
    invited_id = request.data.get('invited')
    if inviter and invited_id:
      serialzer = GameInviteSerializer(data=request.data, context={'request' : request})
      if serialzer.is_valid():
        serialzer.save()
        return Response(serialzer.data, status=status.HTTP_201_CREATED)
    errors = serialzer.errors['invited'][0]
    return Response({'error':errors}, status=status.HTTP_400_BAD_REQUEST)



class CancelGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk ,inviter=user)
      serializer = GameInviteSerializer(invite)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)

  def delete(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk, inviter=user)
      invite.delete()
      return Response({"detail": "Game invite deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except:
       return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)


class GetGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(Q(pk=pk) & (Q(inviter=user) | Q(invited=user)))
      serializer = GameInviteSerializer(invite)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)



class AcceptGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk ,invited=user)
      serializer = GameInviteSerializer(invite)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)

  def put(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk)
      try:
        invite.accept(user)
        return Response({'detials' : 'The invite has been accepted successfully'}, status=status.HTTP_200_OK)
      except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)



class DeclineGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk ,invited=user)
      serializer = GameInviteSerializer(invite)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)

  def put(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk)
      try:
        invite.decline(user)
        return Response({'detials' : 'The invite has been accepted successfully'}, status=status.HTTP_200_OK)
      except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)



class ListGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    inivtes = GameInvite.objects.filter(Q(inviter = user) | Q(invited = user))
    serializer = GameInviteSerializer(inivtes, many=True)
    return Response(serializer.data)



class ListSentGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    inivtes = GameInvite.objects.filter(inviter=user)
    serializer = GameInviteSerializer(inivtes, many=True)
    return Response(serializer.data)



class ListReceivedGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    inivtes = GameInvite.objects.filter(invited=user)
    serializer = GameInviteSerializer(inivtes, many=True)
    return Response(serializer.data)
  
