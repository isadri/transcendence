from django.shortcuts import render
from django.contrib.auth import get_user_model

from .models import GameInvite, Game
from .serializers import GameInviteSerializer

from rest_framework import status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


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


class GetGameInvite(APIView):
  permission_classes = [IsAuthenticated]



class AcceptGameInvite(APIView):
  permission_classes = [IsAuthenticated]



class DeclineGameInvite(APIView):
  permission_classes = [IsAuthenticated]



class ListGameInvites(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    user = request.user
    inivtes = GameInvite.objects.filter(inviter=user)
    serializer = GameInviteSerializer(inivtes, many=True)
    return Response(serializer.data)