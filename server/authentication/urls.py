from django.urls import path
from .views import SignupView, LoginView, VerifyEmailOTPView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify_email'),
]

