from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User
import logging

logger = logging.getLogger(__name__)

class BaseUserSerializer(serializers.ModelSerializer):
    """Base serializer for user-related operations"""
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'min_length': 'Password must be at least 6 characters long.',
            'required': 'Password is required.'
        }
    )

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'email': {
                'error_messages': {
                    'required': 'Email is required.',
                    'invalid': 'Enter a valid email address.'
                }
            },
            'first_name': {
                'error_messages': {
                    'required': 'First name is required.',
                    'blank': 'First name cannot be empty.'
                }
            },
            'last_name': {
                'error_messages': {
                    'required': 'Last name is required.',
                    'blank': 'Last name cannot be empty.'
                }
            }
        }

    def validate_email(self, value):
        """Normalize email and check for case-insensitive uniqueness"""
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return value.lower()

    def validate_first_name(self, value):
        """Sanitize and validate first name"""
        cleaned_name = value.strip()
        if not cleaned_name:
            raise serializers.ValidationError("First name cannot be empty.")
        return cleaned_name

    def validate_last_name(self, value):
        """Sanitize and validate last name"""
        cleaned_name = value.strip()
        if not cleaned_name:
            raise serializers.ValidationError("Last name cannot be empty.")
        return cleaned_name

class UserSignupSerializer(BaseUserSerializer):
    """Serializer for regular user registration"""
    def create(self, validated_data):
        try:
            return User.objects.create_user(**validated_data)
        except Exception as e:
            logger.error(f"User creation failed: {str(e)}")
            raise serializers.ValidationError(
                "Account creation failed. Please try again later."
            )

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user authentication"""
    email = serializers.EmailField(
        error_messages={
            'required': 'Email is required.',
            'invalid': 'Enter a valid email address.'
        }
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password is required.'
        }
    )

    def validate(self, attrs):
        request = self.context.get('request')
        try:
            user = authenticate(
                request=request,
                email=attrs.get('email'),
                password=attrs.get('password')
            )
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise serializers.ValidationError(
                "Authentication service unavailable. Please try again later."
            )

        if not user:
            raise serializers.ValidationError({
                'non_field_errors': ['Invalid email or password.']
            })

        if not user.is_active:
            raise serializers.ValidationError({
                'non_field_errors': ['Account is inactive. Please contact support.']
            })

        attrs['user'] = user
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data"""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff')
        read_only_fields = ('id', 'email', 'is_active', 'is_staff')

class AdminSignupSerializer(BaseUserSerializer):
    """Serializer for admin user registration"""
    def create(self, validated_data):
        try:
            return User.objects.create_user(**validated_data, is_staff=True)
        except Exception as e:
            logger.error(f"Admin creation failed: {str(e)}")
            raise serializers.ValidationError(
                "Admin account creation failed. Please try again later."
            )

class AdminLoginSerializer(UserLoginSerializer):
    """Serializer for admin authentication"""
    def validate(self, attrs):
        attrs = super().validate(attrs)
        user = attrs['user']
        
        if not user.is_staff:
            logger.warning(f"Non-admin login attempt: {user.email}")
            raise serializers.ValidationError({
                'non_field_errors': ['You do not have admin privileges.']
            })

        return attrs