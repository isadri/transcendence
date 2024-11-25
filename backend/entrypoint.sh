#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations accounts
python manage.py makemigrations friends
python manage.py migrate

cat << EOF | python manage.py shell
from django.contrib.auth import get_user_model
import os

username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not get_user_model().objects.filter(username=username).exists():
	get_user_model().objects.create_superuser(username, email, password)

EOF

exec "$@" 
