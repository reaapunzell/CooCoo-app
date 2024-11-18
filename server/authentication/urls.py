from django.urls import path
from .views import SignupView, LoginView, VerifyEmailOTPView, ResendOTPView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify_email'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
]

