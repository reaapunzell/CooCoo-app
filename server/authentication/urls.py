from django.urls import path
from .views import SignupView, LoginView, VerifyEmailOTPView, ResendOTPView,UserProfileView,LogoutView,ChangePasswordView,ForgotPasswordView,ResetPasswordView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify_email'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]

