# groups/serializers.py
from rest_framework import serializers
from .models import Product, Group, Participant

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    organizer = serializers.StringRelatedField()  # You can adjust this to return more detailed user info if needed
    participants_count = serializers.IntegerField(source='participants.count', read_only=True)
    progress_percentage = serializers.FloatField(source='current_progress_percentage', read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'product', 'organizer', 'target_goal', 'current_progress', 'status', 'end_date', 'participants_count', 'progress_percentage']


class ParticipantSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # You can adjust this to return more detailed user info
    group = GroupSerializer()

    class Meta:
        model = Participant
        fields = ['id', 'group', 'user', 'quantity', 'amount_contributed', 'status', 'join_date']

