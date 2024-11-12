# groups/serializers.py
from rest_framework import serializers
from .models import Product, Group, Participant

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'product', 'organizer', 'target_goal', 'current_progress', 'status', 'end_date']

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'group', 'user', 'quantity', 'amount_contributed', 'status', 'join_date']

