#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations --noinput accounts chat friends #notifications
python manage.py migrate
python manage.py createsuperuser --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL --noinput
python manage.py runserver 0:8000
# exec "$@"
