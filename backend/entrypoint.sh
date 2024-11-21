#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations 
python manage.py migrate
python manage.py createsuperuser --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL --noinput

exec "$@"
