from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
import secrets

# Add this validator function at the top
def validate_non_empty(value):
    if value.strip() == '':
        raise ValidationError(_("This field cannot be empty."))
    return value

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        """
        Creates and saves a User with the given email, name, and password.
        """
        if not email:
            raise ValidationError(_('The Email field must be set'))
        if not first_name:
            raise ValidationError(_('First name is required'))
        if not last_name:
            raise ValidationError(_('Last name is required'))

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name.strip(),
            last_name=last_name.strip(),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email, name, and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValidationError(_('Superuser must have is_staff=True'))
        if extra_fields.get('is_superuser') is not True:
            raise ValidationError(_('Superuser must have is_superuser=True'))

        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            **extra_fields
        )

    def generate_secure_otp(self):
        """Generate a cryptographically secure 6-digit OTP"""
        return ''.join(secrets.choice('0123456789') for _ in range(6))

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        _('email address'),
        unique=True,
        db_index=True,
        error_messages={
            'unique': _('A user with that email already exists'),
        }
    )
    email_verified = models.BooleanField(
        _('email verified'),
        default=False,
        help_text=_('Designates whether this user has verified their email address')
    )
    otp = models.CharField(
        _('one-time password'),
        max_length=6,
        blank=True,
        null=True,
        editable=False
    )
    otp_created_at = models.DateTimeField(
        _('OTP creation timestamp'),
        blank=True,
        null=True,
        editable=False
    )
    otp_attempts = models.PositiveSmallIntegerField(
        _('OTP attempts'),
        default=0,
        editable=False,
        help_text=_('Number of consecutive failed OTP attempts')
    )
    first_name = models.CharField(
        _('first name'),
        max_length=30,
        validators=[validate_non_empty]  # Changed to named function
    )
    last_name = models.CharField(
        _('last name'),
        max_length=30,
        validators=[validate_non_empty]  # Changed to named function
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        )
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site')
    )
    date_joined = models.DateTimeField(
        _('date joined'),
        default=timezone.now,
        editable=False
    )

    # Custom permissions and groups with conflict-free related names
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="custom_user_set",
        related_query_name="custom_user"
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="custom_user_set",
        related_query_name="custom_user"
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_staff']),
        ]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Return the full name of the user"""
        return f"{self.first_name} {self.last_name}".strip()

    def clean(self):
        """Normalize and validate fields"""
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)
        self.first_name = self.first_name.strip()
        self.last_name = self.last_name.strip()

    def generate_otp(self):
        """Generate and save a new OTP with timestamp"""
        self.otp = self.__class__.objects.generate_secure_otp()
        self.otp_created_at = timezone.now()
        self.otp_attempts = 0
        self.save(update_fields=['otp', 'otp_created_at', 'otp_attempts'])
        return self.otp

    def is_otp_valid(self, otp):
        """Check if provided OTP is valid and not expired"""
        if not self.otp or not self.otp_created_at:
            return False
        
        expiration_time = self.otp_created_at + timezone.timedelta(minutes=15)
        return (
            self.otp == otp and
            timezone.now() <= expiration_time and
            self.otp_attempts < 5
        )

    def increment_otp_attempts(self):
        """Increment failed OTP attempts counter"""
        self.otp_attempts = models.F('otp_attempts') + 1
        self.save(update_fields=['otp_attempts'])

    def reset_otp(self):
        """Clear OTP-related fields"""
        self.otp = None
        self.otp_created_at = None
        self.otp_attempts = 0
        self.save(update_fields=['otp', 'otp_created_at', 'otp_attempts'])

    def is_regular_user(self):
        """Check if user is a regular non-admin user"""
        return self.is_active and not self.is_staff

    def is_admin_user(self):
        """Check if user has admin privileges"""
        return self.is_active and self.is_staff
