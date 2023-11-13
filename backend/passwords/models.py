import string, random
from datetime import timedelta

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone

from passwords.managers import Manager


class User(AbstractBaseUser, PermissionsMixin):

    class Roles(models.TextChoices):
        USER = ('user', 'user')
        MODERATOR = ('moderator', 'moderator')
        ADMIN = ('admin', 'admin')

    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    username = models.CharField(max_length=100, blank=False, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    role = models.CharField(max_length=50, choices=Roles.choices, default=Roles.USER)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    per_page = models.IntegerField(default=25)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    objects = Manager()

    def __str__(self):
        return f"username: {self.username}; password: {self.password}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=2000, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    marital_status = models.CharField(max_length=20, blank=True)
    birthday = models.DateField(null=True, blank=True)
    instagram = models.CharField(blank=True, max_length=100)


class RegistrationCode(models.Model):
    code = models.CharField(max_length=5, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    expires_at = models.DateTimeField()

    @staticmethod
    def generate_code(user):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        expires_at = timezone.now() + timedelta(minutes=10)
        registration_code = RegistrationCode.objects.create(code=code, user=user, expires_at=expires_at)
        return registration_code


class Vault(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vaults")
    master_password = models.CharField(max_length=200, blank=False)


class Tag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tags")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="tags")
    title = models.CharField(max_length=30, blank=False)


class PasswordAccount(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    password = models.CharField(max_length=200, blank=False)
    website_or_app = models.CharField(max_length=100, blank=False)
    note = models.CharField(max_length=200, blank=True, default="")
    username_or_email = models.CharField(max_length=100, blank=False)
    tags = models.ManyToManyField(Tag, through="TagPassword")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="account_passwords")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="account_passwords")


class PasswordClassic(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    password = models.CharField(max_length=200, blank=False)
    used_for = models.CharField(max_length=200, blank=False)
    note = models.CharField(max_length=200, blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="classic_passwords")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="classic_passwords")


class TagPassword(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=200, blank=True, default="")
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="tagged_passwords")
    password = models.ForeignKey(PasswordAccount, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['tag', 'password'], name='unique_tag_account')
        ]
