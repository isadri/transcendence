from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create multiple test users'

    def handle(self, *args, **kwargs):
        users_data = [
            {'username': 'user1', 'email': 'user1@example.com', 'password': 'password'},
            {'username': 'user2', 'email': 'user2@example.com', 'password': 'password'},
            {'username': 'user3', 'email': 'user3@example.com', 'password': 'password'},
            {'username': 'user4', 'email': 'user4@example.com', 'password': 'password'},
            {'username': 'user5', 'email': 'user5@example.com', 'password': 'password'},
            {'username': 'user6', 'email': 'user6@example.com', 'password': 'password'},
            {'username': 'user7', 'email': 'user7@example.com', 'password': 'password'},
            {'username': 'user8', 'email': 'user8@example.com', 'password': 'password'},
            {'username': 'user9', 'email': 'user9@example.com', 'password': 'password'},
            {'username': 'user10', 'email': 'user10@example.com', 'password': 'password'},
        ]

        for user_data in users_data:
            if not User.objects.filter(username=user_data['username']).exists():
                User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password'],
                    email_verified=True
                )
                self.stdout.write(self.style.SUCCESS(f"User {user_data['username']} created."))
            else:
                self.stdout.write(self.style.WARNING(f"User {user_data['username']} already exists."))
