#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations --noinput accounts chat friends game notifications
python manage.py migrate

daphne -p 8000 -b 0.0.0.0 config.asgi:application