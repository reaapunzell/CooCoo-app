import random
from django.core.mail import send_mail
from django.utils.timezone import now
from datetime import timedelta

def generate_otp():
    """Generate a 4-digit random OTP."""
    return str(random.randint(1000, 9999))

def send_otp_email(email, otp):
    """Send OTP to the user's email for email verification."""
    subject = "Your Email Verification OTP"
    message = f"Your OTP for email verification is {otp}. It is valid for 5 minutes."
    send_mail(subject, message, 'your_email@gmail.com', [email])

def send_password_reset_otp(email, otp):
    """Send OTP to the user's email for password reset."""
    subject = "Your Password Reset OTP"
    message = f"Your OTP for password reset is {otp}. It is valid for 5 minutes."
    send_mail(subject, message, 'your_email@gmail.com', [email])

def is_otp_valid(user, otp):
    """Check if the provided OTP is valid within 5 minutes."""
    otp_validity_duration = timedelta(minutes=5)
    return user.otp == otp and now() - user.otp_created_at <= otp_validity_duration

