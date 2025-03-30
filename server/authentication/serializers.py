from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)  # authenticate using email and password
        if user and user.is_active:
            return data  # Return data, not the user object
        raise serializers.ValidationError("Incorrect credentials or inactive account.")

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff')

# Admin serializers
class AdminSignupSerializer(UserSignupSerializer):
    """Serializer for admin signup, ensures is_staff=True"""
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            is_staff=True  # Set as staff by default
        )
        return user

class AdminLoginSerializer(UserLoginSerializer):
    """Serializer for admin login, ensures user is staff"""
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
        if user and user.is_active:
            if not user.is_staff:
                raise serializers.ValidationError("This account is not an admin.")
            return data
        raise serializers.ValidationError("Incorrect credentials or inactive account.")


