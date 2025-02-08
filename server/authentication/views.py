from rest_framework.views import APIView
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSignupSerializer, UserLoginSerializer, UserProfileSerializer
from .utils import generate_otp, send_otp_email, send_password_reset_otp
from drf_yasg import openapi
from .models import User
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
import random

# Function to generate JWT tokens for the user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class SignupView(APIView):
    @swagger_auto_schema(request_body=UserSignupSerializer)
    def post(self, request, *args, **kwargs):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp = generate_otp()
            user.otp = otp
            user.otp_created_at = now()
            user.save()
            send_otp_email(user.email, otp)
            return Response({"message": "User registered successfully. Please verify your email with the OTP sent."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailOTPView(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
            'otp': openapi.Schema(type=openapi.TYPE_STRING, description='OTP received by email'),
        },
        required=['email', 'otp']
    ))
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            otp_validity_duration = timedelta(minutes=5)

            if user.otp == otp:
                if now() - user.otp_created_at <= otp_validity_duration:
                    user.email_verified = True
                    user.otp = None
                    user.save()
                    return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "OTP expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class ResendOTPView(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
        },
        required=['email']
    ))
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if user.email_verified:
                return Response({"message": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a new OTP and update the user record
            new_otp = f"{random.randint(1000, 9999)}"
            user.otp = new_otp
            user.otp_created_at = now()
            user.save()

            # Send the OTP
            send_otp_email(user.email, new_otp)

            return Response({"message": "A new OTP has been sent to your email."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    @swagger_auto_schema(request_body=UserLoginSerializer)
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(username=email, password=password)

            if user is not None:
                if not user.email_verified:
                    return Response({"error": "Email not verified. Please verify your email."}, status=status.HTTP_403_FORBIDDEN)
                if user.is_active:
                    tokens = get_tokens_for_user(user)
                    return Response({
                        'message': 'Login successful.',
                        'user_id': user.id,
                        'access_token': tokens['access'],
                        'refresh_token': tokens['refresh']
                    }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials or inactive account."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer token for authentication", type=openapi.TYPE_STRING)
        ],
        responses={200: UserProfileSerializer}
    )
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer token for authentication", type=openapi.TYPE_STRING)
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh_token': openapi.Schema(type=openapi.TYPE_STRING, description="User's refresh token"),
            },
            required=['refresh_token']
        )
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token or already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer token for authentication", type=openapi.TYPE_STRING)
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'old_password': openapi.Schema(type=openapi.TYPE_STRING, description="Current password"),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description="New password"),
            },
            required=['old_password', 'new_password']
        )
    )
    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not check_password(old_password, user.password):
            return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description="User email"),
        },
        required=['email']
    ))
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
            reset_otp = generate_otp()
            user.otp = reset_otp
            user.otp_created_at = now()
            user.save()
            send_password_reset_otp(user.email, reset_otp)

            return Response({"message": "OTP sent to email for password reset."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description="User email"),
            'otp': openapi.Schema(type=openapi.TYPE_STRING, description="OTP received via email"),
            'new_password': openapi.Schema(type=openapi.TYPE_STRING, description="New password"),
        },
        required=['email', 'otp', 'new_password']
    ))
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        try:
            user = User.objects.get(email=email)
            otp_validity_duration = timedelta(minutes=5)

            if user.otp == otp and now() - user.otp_created_at <= otp_validity_duration:
                user.set_password(new_password)
                user.otp = None
                user.save()
                return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

