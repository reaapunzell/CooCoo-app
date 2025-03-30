import logging
import secrets
from django.core.mail import send_mail
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils import timezone
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

# Renamed to match the import
def generate_otp(length=6):
    """Generate cryptographically secure OTP"""
    return ''.join(secrets.choice('0123456789') for _ in range(length))

def send_otp_email(email, otp, otp_expiry_minutes=15):
    """Send OTP email using template"""
    try:
        validate_email(email)
        context = {
            'otp': otp,
            'app_name': settings.APP_NAME,
            'expiry_minutes': otp_expiry_minutes,
            'support_email': settings.SUPPORT_EMAIL
        }
        
        html_message = render_to_string('emails/otp_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=f"{settings.APP_NAME} Email Verification",
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        logger.error(f"Failed to send OTP email: {str(e)}")
        raise
