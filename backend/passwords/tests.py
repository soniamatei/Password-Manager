from django.test import TestCase
from rest_framework.reverse import reverse
from rest_framework import status

from .models import *


class TestOrderVaultsByPasswords(TestCase):
    def setUp(self) -> None:
        self.vault1 = Vault.objects.create(title="vault1", master_password="fndhfund")
        self.vault2 = Vault.objects.create(title="vault2", master_password="fakakakdhnd")

        self.passw1 = PasswordAccount.objects.create(
            vault=self.vault1,
            password="blabla",
            website_or_app="amazon",
            username_or_email="soniam"
        )
        self.passw2 = PasswordAccount.objects.create(
            vault=self.vault1,
            password="blablabl",
            website_or_app="google",
            username_or_email="soniam"
        )
        self.passw3 = PasswordAccount.objects.create(
            vault=self.vault2,
            password="blabl",
            website_or_app="facebook",
            username_or_email="soniam"
        )

    def test_statistic(self):
        url = reverse('statistics-vault')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.assertEqual(response.data[0]['id'], self.vault1.id)
        self.assertEqual(response.data[0]['avg_password_length'], 7.0)

        self.assertEqual(response.data[1]['id'], self.vault2.id)
        self.assertEqual(response.data[1]['avg_password_length'], 5.0)


class TestOrderPasswordsByTags(TestCase):
    def setUp(self) -> None:
        self.vault1 = Vault.objects.create(title="vault1", master_password="fndhfund")
        self.vault2 = Vault.objects.create(title="vault2", master_password="fakakakdhnd")

        self.passw1 = PasswordAccount.objects.create(
            vault=self.vault1,
            password="blabla",
            website_or_app="amazon",
            username_or_email="soniam"
        )
        self.passw2 = PasswordAccount.objects.create(
            vault=self.vault1,
            password="blablabl",
            website_or_app="google",
            username_or_email="soniam"
        )
        self.passw3 = PasswordAccount.objects.create(
            vault=self.vault2,
            password="blabl",
            website_or_app="facebook",
            username_or_email="soniam"
        )

        self.tag1 = Tag.objects.create(
            vault=self.vault1,
            title="google"
        )

        self.relation1 = TagPassword.objects.create(
            tag=self.tag1,
            password=self.passw1
        )

    def test_statistic(self):
        url = reverse('statistics-password')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

        self.assertEqual(response.data[0]['id'], self.passw1.id)
        self.assertEqual(response.data[0]['count_tags'], 1.0)

        self.assertEqual(response.data[1]['count_tags'], 0.0)
        self.assertEqual(response.data[2]['count_tags'], 0.0)
