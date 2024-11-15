from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Province, City, Product, Group, Participant, Order

User = get_user_model()

# Province Serializer
class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name']


# City Serializer
class CitySerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True)

    class Meta:
        model = City
        fields = ['id', 'name', 'province']


# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price_per_unit', 'unit',
            'available_quantity', 'discounted_price', 'image_url', 'delivery_information'
        ]


# Group Serializer
class GroupSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    organizer = serializers.StringRelatedField(read_only=True)
    city = CitySerializer(read_only=True)

    class Meta:
        model = Group
        fields = [
            'id', 'name', 'product', 'organizer', 'city',
            'target_goal', 'current_progress', 'price_per_person',
            'end_date', 'status'
        ]


# Participant Serializer
class ParticipantSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    group = GroupSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = [
            'id', 'user', 'group', 'quantity', 'amount_contributed',
            'joined_at', 'status'
        ]


# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    group = GroupSerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'group', 'first_name', 'last_name', 'province',
            'city', 'zip_code', 'street', 'shipping_method', 'payment_method',
            'card_number', 'expiry_date', 'cvv', 'total_amount', 'created_at'
        ]
        extra_kwargs = {
            'card_number': {'write_only': True},
            'expiry_date': {'write_only': True},
            'cvv': {'write_only': True},
        }

    def validate(self, data):
        # Ensure card details are provided if payment method is 'Card'
        if data['payment_method'] == 'Card' and not all([data.get('card_number'), data.get('expiry_date'), data.get('cvv')]):
            raise serializers.ValidationError("Card payment requires card details.")
        return data

