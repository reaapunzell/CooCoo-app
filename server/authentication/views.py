from rest_framework.views import APIView
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSignupSerializer,UserLoginSerializer
from .utils import generate_otp, send_otp_email
from drf_yasg import openapi
from .models import User

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
    @swagger_auto_schema(
        operation_description="Verify email using a 4-digit OTP sent to the user's email address.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email', description='User email address'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='4-digit OTP sent to email'),
            },
            required=['email', 'otp']
        ),
        responses={
            200: openapi.Response(
                description="Email verified successfully.",
                examples={
                    "application/json": {"message": "Email verified successfully."}
                }
            ),
            400: openapi.Response(
                description="Bad request - Invalid or expired OTP.",
                examples={
                    "application/json": {"error": "Invalid or expired OTP."}
                }
            ),
            404: openapi.Response(
                description="User not found.",
                examples={
                    "application/json": {"error": "User not found."}
                }
            ),
        }
    )
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.otp == otp and (now() - user.otp_created_at).seconds <= 300:
                user.email_verified = True
                user.otp = None  # Clear OTP after verification
                user.save()
                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
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

