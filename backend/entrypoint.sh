#!/bin/sh

echo "Running database migrations"
python manage.py makemigrations --noinput accounts chat friends game notifications
python manage.py migrate
python manage.py createTestingUsers # create many user for testing

python manage.py runserver 0:8000

