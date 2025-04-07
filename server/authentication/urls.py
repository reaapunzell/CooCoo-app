# urls.py
from django.urls import path
from .views import (
    UserSignupView,
    AdminSignupView,
    VerifyEmailView,
    AdminVerifyEmailView,
    UserLoginView,
    AdminLoginView,
    ResendOTPView,
    UserProfileView,
    LogoutView,
    ChangePasswordView,
    ForgotPasswordView, 
    ResetPasswordView
)

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='user_signup'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin_signup'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('admin/verify-email/', AdminVerifyEmailView.as_view(), name='admin_verify_email'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),

]
