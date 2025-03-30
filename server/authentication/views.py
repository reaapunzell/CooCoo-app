from rest_framework.views import APIView
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSignupSerializer,UserLoginSerializer, AdminSignupSerializer, AdminLoginSerializer
from .utils import generate_otp, send_otp_email
from drf_yasg import openapi
from .models import User
from datetime import timedelta
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
            
            # Generate OTP and send it to the user
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
                    user.otp = None  # Clear OTP after successful verification
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


# Admin views
class AdminSignupView(APIView):
    @swagger_auto_schema(request_body=AdminSignupSerializer)
    def post(self, request, *args, **kwargs):
        serializer = AdminSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp = generate_otp()
            user.otp = otp
            user.otp_created_at = now()
            user.save()
            send_otp_email(user.email, otp)
            return Response({"message": "Admin registered successfully. Please verify your email with the OTP sent."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    @swagger_auto_schema(request_body=AdminLoginSerializer)
    def post(self, request, *args, **kwargs):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(username=email, password=password)
            if user is not None:
                if not user.email_verified:
                    return Response({"error": "Email not verified. Please verify your email."}, status=status.HTTP_403_FORBIDDEN)
                if user.is_active and user.is_staff:
                    tokens = get_tokens_for_user(user)
                    return Response({
                        'message': 'Admin login successful.',
                        'user_id': user.id,
                        'access_token': tokens['access'],
                        'refresh_token': tokens['refresh']
                    }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials or not an admin account."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminVerifyEmailOTPView(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Admin email'),
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
            if not user.is_staff:
                return Response({"error": "This endpoint is for admin users only."}, status=status.HTTP_403_FORBIDDEN)

            otp_validity_duration = timedelta(minutes=5)
            if user.otp == otp:
                if now() - user.otp_created_at <= otp_validity_duration:
                    user.email_verified = True
                    user.otp = None
                    user.save()
                    return Response({"message": "Admin email verified successfully."}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "OTP expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Admin user not found."}, status=status.HTTP_404_NOT_FOUND)


