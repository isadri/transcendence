from django.db import models
from django.db.models import fields
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import GameInvite, UserAchiavements, UserStats

User = get_user_model()


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
    model = UserAchiavements
    fields =['name']

class UserStatsSerializer(serializers.ModelSerializer):
  achievements = UserAchievementSerializer(many=True)
  class Meta:
    model = UserStats
    fields =['user', 'achievements', 'level', 'badge', 'win', 'lose']

# class AddAchievementView(APIView):
#     def post(self, request, achievement_id):
#         achievement = get_object_or_404(UserAchievement, id=achievement_id)
#         user_state = UserState.objects.get(user=request.user)

#         if achievement not in user_state.achievements.all():
#             user_state.achievements.add(achievement)
#             return Response({"message": "Achievement added successfully"})
#         else:
#             return Response({"message": "Achievement already exists"}, status=400)