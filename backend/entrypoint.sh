#!/bin/sh

if [ ! -d /code/static ]; then
	echo "Collect static files"
	python manage.py collectstatic
fi;

echo "Running database migrations"
python manage.py makemigrations --noinput accounts chat friends game notifications
python manage.py migrate

if [ -z "$DJANGO_SUPERUSER_USERNAME" ]; then
	echo "DJANGO_SUPERUSER_USERNAME environment variable is not set";
fi;

if [ -z "$DJANGO_SUPERUSER_EMAIL" ]; then
	echo "DJANGO_SUPERUSER_EMAIL environment variable is not set";
fi;

if [ -z "$DJANGO_SUPERUSER_PASSWORD" ]; then
	echo "DJANGO_SUPERUSER_PASSWORD environment variable is not set";
fi;

cat << EOF | python manage.py shell
from django.contrib.auth import get_user_model
import os

username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not get_user_model().objects.filter(username=username).exists():
	get_user_model().objects.create_superuser(username, email, password)

EOF

python manage.py runserver 0:8000

