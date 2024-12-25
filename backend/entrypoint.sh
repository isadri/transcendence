#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations --noinput accounts chat friends game notifications
python manage.py migrate

cat << EOF | python manage.py shell
import os
from django.contrib.auth import get_user_model


username = os.gentenv('DJANGO_SUPERUSER_USERNAME')
email = os.gentenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_EMAIL')

if not get_user_model().objects.filter(username=username).exists():
    get_user_model().objects.create_superuser(username, email, password)

EOF

python manage.py 0:8000

