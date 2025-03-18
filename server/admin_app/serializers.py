# admin_app/serializers.py
from rest_framework import serializers
from authentication.models import User
from groups.models import Group, Participant
from authentication.serializers import UserProfileSerializer
from groups.serializers import ParticipantSerializer

class AdminGroupSerializer(serializers.ModelSerializer):
    organizer = UserProfileSerializer(read_only=True)
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'organizer', 'product', 'target_goal', 'current_progress', 'status', 'participants']
