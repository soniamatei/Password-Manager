from django.contrib.auth.base_user import BaseUserManager
from django.core.mail import send_mail


class Manager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError("The username must be set.")
        if not email:
            raise ValueError("The email must be set.")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()

        from passwords.models import UserProfile
        profile = UserProfile.objects.create(user=user)
        profile.save()

        from passwords.models import RegistrationCode
        registration_code = RegistrationCode.generate_code(user)

        from lab_1_914_Matei_Sonia import settings
        subject = "Password - confirmation code"
        message = "Code: " + registration_code.code

        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [email], fail_silently=False)
        except Exception as e:
            print(e)
            user.delete()
            raise ValueError("not email")

        return user

    def update_user(self, user, username=None, email=None, password=None, **extra_fields):
        if username:
            user.username = username
        if email:
            user.email = self.normalize_email(email)
        if password:
            user.set_password(password)
        for key, value in extra_fields.items():
            setattr(user, key, value)
        user.save()
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, email, password, **extra_fields)