from django.urls import path
from .views import SignupView, LoginView, VerifyEmailOTPView, ResendOTPView, AdminSignupView, AdminLoginView, AdminVerifyEmailOTPView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify_email'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),



    # Admin endpoints
    path('admin-signup/',AdminSignupView.as_view(), name='admin_signup'),
    path('admin-login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin-verify-otp/', views.AdminVerifyEmailOTPView.as_view(), name='admin_verify_otp'),

]

