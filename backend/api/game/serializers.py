from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import GameInvite

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
    return invited
  

  def create(self, validated_data: dict) -> GameInvite:
    print('hello')
    print(validated_data)
    inviter = self.context['request'].user
    invited = validated_data.get('invited')
    invite, created = GameInvite.objects.get_or_create(inviter=inviter, invited=invited)
    # if created
    return invite