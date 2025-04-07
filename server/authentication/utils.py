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

def send_password_change_email(user):
    """Send password change notification email using template."""
    try:
        context = {
            'user': user,
            'timestamp': timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            'app_name': settings.APP_NAME,
            'support_email': settings.SUPPORT_EMAIL,
        }

        html_message = render_to_string('emails/password_changed.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=f"{settings.APP_NAME} Password Change Notification",
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as e:
        logger.error(f"Failed to send password change email: {str(e)}")
        raise


def send_password_reset_otp(email, otp, otp_expiry_minutes=5):
    """Send password reset OTP to user"""
    try:
        validate_email(email)
        context = {
            'otp': otp,
            'app_name': settings.APP_NAME,
            'expiry_minutes': otp_expiry_minutes,
            'support_email': settings.SUPPORT_EMAIL
        }

        html_message = render_to_string('emails/password_reset_otp.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=f"{settings.APP_NAME} Password Reset OTP",
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"Password reset OTP sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        raise


def send_password_reset_success_email(email):
    """Send confirmation email after password reset"""
    try:
        validate_email(email)
        context = {
            'app_name': settings.APP_NAME,
            'support_email': settings.SUPPORT_EMAIL
        }

        html_message = render_to_string('emails/password_reset_success.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=f"{settings.APP_NAME} Password Successfully Reset",
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"Password reset success email sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send password reset success email to {email}: {str(e)}")
        raise
