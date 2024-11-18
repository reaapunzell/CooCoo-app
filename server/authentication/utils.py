import random
from django.core.mail import send_mail
from django.utils.timezone import now

def generate_otp():
    """Generate a 4-digit random OTP."""
    return str(random.randint(1000, 9999))

def send_otp_email(email, otp):
    """Send OTP to the user's email."""
    subject = "Your Email Verification OTP"
    message = f"Your OTP for email verification is {otp}."
    send_mail(subject, message, 'your_email@gmail.com', [email])

