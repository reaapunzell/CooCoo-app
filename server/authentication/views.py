from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import secrets
import logging

from .serializers import (
    UserSignupSerializer,
    UserLoginSerializer,
    AdminSignupSerializer,
    AdminLoginSerializer,
    UserProfileSerializer
)
from .utils import generate_otp, send_otp_email
from .models import User

logger = logging.getLogger(__name__)

# Common Swagger schemas
email_otp_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
        'otp': openapi.Schema(type=openapi.TYPE_STRING, max_length=6)
    },
    required=['email', 'otp']
)

email_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, format='email')
    },
    required=['email']
)

class BaseAuthView(APIView):
    """Base class for authentication-related views"""
    authentication_classes = []
    permission_classes = []

    def handle_exception(self, exc):
        """Custom exception handling for consistent error responses"""
        if isinstance(exc, exceptions.APIException):
            return Response(
                {'detail': exc.detail, 'code': exc.get_codes()},
                status=exc.status_code
            )
        logger.error(f"Unexpected error: {str(exc)}")
        return Response(
            {'detail': 'An unexpected error occurred'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class TokenMixin:
    """Mixin for JWT token generation"""
    
    @staticmethod
    def get_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'access_expires': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
            'refresh_expires': int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        }

class BaseSignupView(BaseAuthView):
    """Base class for user signup functionality"""
    otp_validity = timedelta(minutes=5)
    max_otp_attempts = 3

    def finalize_signup(self, user):
        """Finalize user registration with OTP"""
        user.otp = generate_otp()
        user.otp_created_at = timezone.now()
        user.otp_attempts = 0
        user.save(update_fields=['otp', 'otp_created_at', 'otp_attempts'])
        
        try:
            send_otp_email(user.email, user.otp)
        except Exception as e:
            logger.error(f"Failed to send OTP email: {str(e)}")
            raise exceptions.APIException(
                "Failed to send verification email. Please try again later.",
                code='email_send_failure'
            )

class UserSignupView(BaseSignupView):
    """Handle regular user registration"""
    
    @swagger_auto_schema(
        operation_description="Register a new user account",
        request_body=UserSignupSerializer,
        responses={
            201: openapi.Response(
                'Registration successful',
                examples={
                    'application/json': {
                        "detail": "Registration successful. Please verify your email."
                    }
                }
            ),
            400: openapi.Response(
                'Validation Error',
                examples={
                    'application/json': {
                        "email": ["This field is required."],
                        "password": ["This field is required."]
                    }
                }
            ),
            500: openapi.Response(
                'Server Error',
                examples={
                    'application/json': {
                        "detail": "Registration failed. Please try again."
                    }
                }
            )
        }
    )
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
            self.finalize_signup(user)
            return Response(
                {'detail': 'Registration successful. Please verify your email.'},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"User registration failed: {str(e)}")
            raise exceptions.APIException(
                "Registration failed. Please try again.",
                code='registration_failure'
            )

class AdminSignupView(BaseSignupView):
    

    """Handle admin registration (requires existing admin privileges)"""
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Register a new admin account (requires admin privileges)",
        request_body=AdminSignupSerializer,
        security=[{'Bearer': []}],
        responses={
            201: openapi.Response(
                'Admin registration successful',
                examples={
                    'application/json': {
                        "detail": "Admin registration successful. Please verify your email."
                    }
                }
            ),
            400: openapi.Response(
                'Validation Error',
                examples={
                    'application/json': {
                        "email": ["This field is required."],
                        "password": ["This field is required."]
                    }
                }
            ),
            403: openapi.Response(
                'Forbidden',
                examples={
                    'application/json': {
                        "detail": "You do not have permission to perform this action."
                    }
                }
            ),
            500: openapi.Response(
                'Server Error',
                examples={
                    'application/json': {
                        "detail": "Admin registration failed. Please try again."
                    }
                }
            )
        }
    )
    def post(self, request):
        serializer = AdminSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
            self.finalize_signup(user)
            return Response(
                {'detail': 'Admin registration successful. Please verify your email.'},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Admin registration failed: {str(e)}")
            raise exceptions.APIException(
                "Admin registration failed. Please try again.",
                code='admin_registration_failure'
            )

class BaseVerifyEmailView(BaseAuthView):
    """Base class for email verification"""
    otp_validity = timedelta(minutes=5)
    max_otp_attempts = 3

    @swagger_auto_schema(
        request_body=email_otp_schema,
        responses={
            200: openapi.Response(
                'Verification successful',
                examples={
                    'application/json': {
                        "detail": "Email verified successfully"
                    }
                }
            ),
            400: openapi.Response(
                'Validation Error',
                examples={
                    'application/json': {
                        "detail": "Invalid OTP"
                    }
                }
            ),
            404: openapi.Response(
                'Not Found',
                examples={
                    'application/json': {
                        "detail": "User not found"
                    }
                }
            )
        }
    )
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            raise exceptions.ValidationError(
                {'detail': 'Both email and OTP are required'},
                code='missing_credentials'
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise exceptions.NotFound({'detail': 'User not found'})

        if user.otp_attempts >= self.max_otp_attempts:
            raise exceptions.PermissionDenied(
                {'detail': 'Maximum OTP attempts exceeded. Please request a new OTP.'},
                code='max_attempts_exceeded'
            )

        if user.otp != otp:
            user.otp_attempts += 1
            user.save(update_fields=['otp_attempts'])
            raise exceptions.ValidationError(
                {'detail': 'Invalid OTP'},
                code='invalid_otp'
            )

        if timezone.now() - user.otp_created_at > self.otp_validity:
            raise exceptions.ValidationError(
                {'detail': 'OTP has expired'},
                code='expired_otp'
            )

        user.email_verified = True
        user.otp = None
        user.otp_attempts = 0
        user.save(update_fields=['email_verified', 'otp', 'otp_attempts'])
        
        return Response(
            {'detail': 'Email verified successfully'},
            status=status.HTTP_200_OK
        )

class VerifyEmailView(BaseVerifyEmailView):
    """Handle email verification for regular users"""

class AdminVerifyEmailView(BaseVerifyEmailView):
    """Handle email verification for admin users"""
    
    @swagger_auto_schema(
        request_body=email_otp_schema,
        responses={
            200: openapi.Response(
                'Verification successful',
                examples={
                    'application/json': {
                        "detail": "Admin email verified successfully"
                    }
                }
            ),
            403: openapi.Response(
                'Forbidden',
                examples={
                    'application/json': {
                        "detail": "Admin verification failed"
                    }
                }
            )
        }
    )
    def post(self, request):
        response = super().post(request)
        user = User.objects.get(email=request.data['email'])
        if not user.is_staff:
            user.delete()
            raise exceptions.PermissionDenied(
                {'detail': 'Admin verification failed'},
                code='invalid_admin_verification'
            )
        return response

class BaseLoginView(BaseAuthView, TokenMixin):
    """Base class for authentication"""
    
    def validate_user(self, user):
        if not user.email_verified:
            raise exceptions.PermissionDenied(
                {'detail': 'Email not verified'},
                code='email_not_verified'
            )
            
        if not user.is_active:
            raise exceptions.PermissionDenied(
                {'detail': 'Account is inactive'},
                code='account_inactive'
            )

    def create_login_response(self, user):
        tokens = self.get_tokens_for_user(user)
        return Response({
            'detail': 'Login successful',
            'user_id': user.id,
            'access_token': tokens['access'],
            'access_expires': tokens['access_expires'],
            'refresh_token': tokens['refresh'],
            'refresh_expires': tokens['refresh_expires']
        })

class UserLoginView(BaseLoginView):
    """Handle user authentication"""
    
    @swagger_auto_schema(
        operation_description="Authenticate regular user",
        request_body=UserLoginSerializer,
        responses={
            200: openapi.Response(
                'Login successful',
                examples={
                    'application/json': {
                        "detail": "Login successful",
                        "user_id": 1,
                        "access_token": "eyJhbGciOi...",
                        "access_expires": 900,
                        "refresh_token": "eyJhbGciOi...",
                        "refresh_expires": 86400
                    }
                }
            ),
            401: openapi.Response(
                'Unauthorized',
                examples={
                    'application/json': {
                        "detail": "Invalid credentials"
                    }
                }
            )
        }
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            request=request,
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if not user:
            raise exceptions.AuthenticationFailed(
                {'detail': 'Invalid credentials'},
                code='invalid_credentials'
            )
            
        self.validate_user(user)
        return self.create_login_response(user)

class AdminLoginView(BaseLoginView):
    """Handle admin authentication"""
    
    @swagger_auto_schema(
        operation_description="Authenticate admin user",
        request_body=AdminLoginSerializer,
        responses={
            200: openapi.Response(
                'Login successful',
                examples={
                    'application/json': {
                        "detail": "Admin login successful",
                        "user_id": 1,
                        "access_token": "eyJhbGciOi...",
                        "access_expires": 900,
                        "refresh_token": "eyJhbGciOi...",
                        "refresh_expires": 86400
                    }
                }
            ),
            401: openapi.Response(
                'Unauthorized',
                examples={
                    'application/json': {
                        "detail": "Invalid admin credentials"
                    }
                }
            )
        }
    )
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            request=request,
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if not user or not user.is_staff:
            raise exceptions.AuthenticationFailed(
                {'detail': 'Invalid admin credentials'},
                code='invalid_admin_credentials'
            )
            
        self.validate_user(user)
        return self.create_login_response(user)

class ResendOTPView(BaseAuthView):
    """Handle OTP resend requests"""
    
    @swagger_auto_schema(
        operation_description="Resend OTP to user's email",
        request_body=email_schema,
        responses={
            200: openapi.Response(
                'OTP resent',
                examples={
                    'application/json': {
                        "detail": "New OTP sent successfully"
                    }
                }
            ),
            400: openapi.Response(
                'Bad Request',
                examples={
                    'application/json': {
                        "detail": "Email is already verified"
                    }
                }
            ),
            404: openapi.Response(
                'Not Found',
                examples={
                    'application/json': {
                        "detail": "User not found"
                    }
                }
            )
        }
    )
    def post(self, request):
        email = request.data.get('email')
        if not email:
            raise exceptions.ValidationError(
                {'detail': 'Email is required'},
                code='missing_email'
            )

        try:
            user = User.objects.get(email=email)
            if user.email_verified:
                return Response(
                    {'detail': 'Email is already verified'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.otp = secrets.choice('0123456789')
            user.otp_created_at = timezone.now()
            user.otp_attempts = 0
            user.save()

            send_otp_email(user.email, user.otp)
            return Response(
                {'detail': 'New OTP sent successfully'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            raise exceptions.NotFound({'detail': 'User not found'})
        except Exception as e:
            logger.error(f"OTP resend failed: {str(e)}")
            raise exceptions.APIException(
                {'detail': 'Failed to resend OTP'},
                code='otp_resend_failure'
            )

class UserProfileView(APIView):
    """Handle user profile management"""
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get current user profile",
        responses={
            200: UserProfileSerializer(),
            401: openapi.Response(
                'Unauthorized',
                examples={
                    'application/json': {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            )
        }
    )
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Update user profile",
        request_body=UserProfileSerializer,
        responses={
            200: UserProfileSerializer(),
            400: openapi.Response(
                'Validation Error',
                examples={
                    'application/json': {
                        "first_name": ["This field is required."]
                    }
                }
            ),
            401: openapi.Response(
                'Unauthorized',
                examples={
                    'application/json': {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            )
        }
    )
    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
