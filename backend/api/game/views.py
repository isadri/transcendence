from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth import get_user_model

from .models import *
from .serializers import *
from .consumers import *

from rest_framework import status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import (
    get_object_or_404,
)

User = get_user_model()

NO_INV_NO_ACCESS = {'error' : 'You dont have access or the invite does not exists'}


class CreateGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request):
    inviter = request.user
    errors = 'Something went wrong'
    invited_id = request.data.get('invited')
    if inviter and invited_id:
      serializer = GameInviteSerializer(data=request.data, context={'user' : request.user})
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
      errors = serializer.errors.get('invited', ['something went wrong'])[0]
    return Response({'error':errors}, status=status.HTTP_400_BAD_REQUEST)



class CancelGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk ,inviter=user)
      serializer = GameInviteSerializer(invite, context={'user' : request.user})
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
      serializer = GameInviteSerializer(invite, context={'user' : request.user})
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)



class AcceptGameInvite(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk ,invited=user)
      serializer = GameInviteSerializer(invite, context={'user' : request.user})
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)

  def put(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk)
      try:
        invite.accept(user)
        return Response({'details' : 'The invite has been accepted successfully'}, status=status.HTTP_200_OK)
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
      serializer = GameInviteSerializer(invite, context={'user' : request.user})
      return Response(serializer.data, status=status.HTTP_200_OK)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)

  def put(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(pk=pk)
      try:
        invite.decline(user)
        FriendGame.warn_invite_refused(pk)
        return Response({'details' : 'The invite has been declined successfully'}, status=status.HTTP_200_OK)
      except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except GameInvite.DoesNotExist:
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)


  def delete(self, request, pk):
    user = request.user
    try:
      invite = GameInvite.objects.get(Q(inviter=user) | Q(invited=user), pk=pk)
      invite.delete()
      return Response({"detail": "Game invite deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except :
      return Response(NO_INV_NO_ACCESS, status=status.HTTP_404_NOT_FOUND)



class ListGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    invites = GameInvite.objects.filter(Q(inviter = user) | Q(invited = user))
    serializer = GameInviteSerializer(invites, many=True, context={'user' : request.user})
    return Response(serializer.data)



class ListSentGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    invites = GameInvite.objects.filter(inviter=user)
    serializer = GameInviteSerializer(invites, many=True, context={'user' : request.user})
    return Response(serializer.data)



class ListReceivedGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    invites = GameInvite.objects.filter(invited=user)
    serializer = GameInviteSerializer(invites, many=True, context={'user' : request.user})
    return Response(serializer.data)


class UserAchievementView(APIView):

  permission_classes = [IsAuthenticated]

  def get(self, request, username):
    try:
      user = get_object_or_404(User, username=username)
      userAch = UserAchievement.objects.filter(user=user)
      serializer = UserAchievementSerializer(userAch, many=True)
      return Response(serializer.data)
    except User.DoesNotExist:
      return Response({'error': 'No such user'}, status=status.HTTP_400_BAD_REQUEST)

class ListUserStats(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, username):
    try:
      user = get_object_or_404(User, username=username)
      userStats = UserStats.objects.filter(user=user)
      serializer = UserStatsSerializer(userStats, many=True)
      return Response(serializer.data)
    except User.DoesNotExist:
      return Response({'error': 'No such user'}, status=status.HTTP_400_BAD_REQUEST)


class GamesList(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user

    games = Game.objects.filter(Q(player1=user) | Q(player2=user))
    serializer = GameSerializer(games, many=True, context={'user' : request.user})
    return Response(serializer.data)

class TournamentList(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    tournaments = Tournament.objects.filter(Q(player1=user) | Q(player2=user) | Q(player3=user) | Q(player4=user)).order_by('winner').reverse()
    serializer = TournamentSerializer(tournaments, many=True, context={'user' : request.user})
    return Response(serializer.data)



class GetTournament(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    user = request.user
    try:
      tournament = Tournament.objects.get(Q(player1=user) | Q(player2=user) | Q(player3=user) | Q(player4=user), pk=pk)
      serializer = TournamentSerializer(tournament, context={'user' : request.user})
      return Response(serializer.data)
    except:
      return Response({"error" : "No tournament exist or you dont have access."}, status=status.HTTP_404_NOT_FOUND)


class GameHistory(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, username):
    try:
      user = get_object_or_404(User, username=username)
      userStats = Game.objects.filter((Q(player1=user) | Q(player2=user)) & Q(progress='E')).order_by('-start_at')
      serializer = GameSerializer(userStats, many=True, context={'user' : request.user})
      return Response(serializer.data)
    except User.DoesNotExist:
      return Response({'error': 'No such user'}, status=status.HTTP_400_BAD_REQUEST)

