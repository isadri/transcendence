from django.db import models
from django.db.models import fields
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model

from rest_framework import serializers


from .models import GameInvite, UserAchievement, UserStats, Game

User = get_user_model()


class GameSerializer(serializers.ModelSerializer):
  player1 = serializers.SerializerMethodField()
  player2 = serializers.SerializerMethodField()
  class Meta:
    model = Game
    fields = '__all__'

  def get_player1(self, obj):
    from ..friends.serializers import FriendSerializer
    serializer = FriendSerializer(obj.player1, context={'user' : self.context['user']})
    return serializer.data

  def get_player2(self, obj):
    from ..friends.serializers import FriendSerializer
    serializer = FriendSerializer(obj.player2, context={'user' : self.context['user']})
    return serializer.data

class GameInviteSerializer(serializers.ModelSerializer):
  sent_at = serializers.DateTimeField(read_only=True)
  status = serializers.ChoiceField(choices=GameInvite.INVITE_STATE, default='P',read_only=True)
  inviter = serializers.PrimaryKeyRelatedField(read_only=True)
  invited = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

  class Meta:
    model = GameInvite
    fields = '__all__'
    read_only_fields = ['invited', 'inviter', 'sent_at'] 


  def validate_invited(self, invited):
    inviter = self.context['request'].user
    if invited == inviter:
      raise serializers.ValidationError("You cannot invite yourself.")
    if GameInvite.objects.filter(inviter=inviter, invited=invited, status='P').exists():
      raise serializers.ValidationError("You have already sent an invite to this user.")
    #adding playing state check
    return invited
  

  def create(self, validated_data: dict) -> GameInvite:
    inviter = self.context['request'].user
    invited = validated_data.get('invited')
    invite = GameInvite.objects.create(inviter=inviter, invited=invited)
    return invite

class UserAchievementSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserAchievement
    fields =['user', 'type', 'name', 'key', 'text']

class UserStatsSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserStats
    fields =['user', 'level', 'badge', 'win', 'lose', 'nbr_games']