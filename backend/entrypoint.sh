#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations
python manage.py migrate

exec "$@"
