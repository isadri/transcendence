#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations --noinput accounts chat friends game notifications
python manage.py migrate
python manage.py createTestingUsers # create many user for testing

cat << EOF | python manage.py shell
import os
from django.contrib.auth import get_user_model


username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not get_user_model().objects.filter(username=username).exists():
    get_user_model().objects.create_superuser(username, email, password)

EOF

python manage.py runserver 0:8000

