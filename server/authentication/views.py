from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSignupSerializer,UserLoginSerializer

# Function to generate JWT tokens for the user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }




class SignupView(APIView):
    @swagger_auto_schema(request_body=UserSignupSerializer)  # This will ensure the body is shown in Swagger
    def post(self, request, *args, **kwargs):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    @swagger_auto_schema(request_body=UserLoginSerializer)  # Include request body in Swagger docs
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            # Corrected way to get email and password from validated data
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # Authenticate the user using the provided credentials
            user = authenticate(request, username=email, password=password)

            if user is not None and user.is_active:
                # Generate JWT token
                tokens = get_tokens_for_user(user)
                
                return Response({
                    'message': 'Login successful.',
                    'access_token': tokens['access'],
                    'refresh_token': tokens['refresh']
                }, status=status.HTTP_200_OK)
            
            return Response({"error": "Invalid credentials or inactive account."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

