#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations accounts
python manage.py makemigrations friends
python manage.py migrate

exec "$@"
