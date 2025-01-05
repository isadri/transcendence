from django.db import models
from django.db.models import fields
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import GameInvite, UserAchievement, UserStats, Game, Tournament

User = get_user_model()


class GameSerializer(serializers.ModelSerializer):
  player1 = serializers.SerializerMethodField()
  player2 = serializers.SerializerMethodField()
  class Meta:
    model = Game
    fields = '__all__'

  def get_player1(self, obj):
    from ..friends.serializers import FriendSerializer
    if not 'user' in self.context:
      return obj.player1.id
    serializer = FriendSerializer(obj.player1, context=self.context)
    return serializer.data

  def get_player2(self, obj):
    from ..friends.serializers import FriendSerializer
    if not 'user' in self.context:
      return obj.player2.id
    serializer = FriendSerializer(obj.player2, context=self.context)
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
    fields = '__all__'

class UserStatsSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserStats
    fields = '__all__'



class TournamentSerializer(serializers.ModelSerializer):
  player1 = serializers.SerializerMethodField()
  player2 = serializers.SerializerMethodField()
  player3 = serializers.SerializerMethodField()
  player4 = serializers.SerializerMethodField()
  winner = serializers.SerializerMethodField()
  
  half1 = serializers.SerializerMethodField()
  half2 = serializers.SerializerMethodField()
  final = serializers.SerializerMethodField()
  class Meta:
    model = Tournament
    fields = '__all__'

  def get_half1(self, obj):
    if obj.half1:
      return GameSerializer(obj.half1).data
    return None

  def get_half2(self, obj):
    if obj.half2:
      return GameSerializer(obj.half2).data
    return None

  def get_final(self, obj):
    if obj.final:
      return GameSerializer(obj.final).data
    return None

  def get_winner(self, obj):
    from ..friends.serializers import FriendSerializer
    if not obj.winner:
      return None
    return FriendSerializer(obj.winner, context=self.context).data

  def get_player1(self, obj):
    from ..friends.serializers import FriendSerializer
    return FriendSerializer(obj.player1, context=self.context).data

  def get_player2(self, obj):
    from ..friends.serializers import FriendSerializer
    return FriendSerializer(obj.player2, context=self.context).data

  def get_player3(self, obj):
    from ..friends.serializers import FriendSerializer
    return FriendSerializer(obj.player3, context=self.context).data

  def get_player4(self, obj):
    from ..friends.serializers import FriendSerializer
    return FriendSerializer(obj.player4, context=self.context).data

