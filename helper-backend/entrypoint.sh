#!/bin/sh

FILE=/opt/.initialized
if [ -f "$FILE" ]; then
    echo "Skipping initialization..."
    echo "If you want to run initialization again remove the file"
else
    python manage.py makemigrations --noinput
    python manage.py migrate --noinput
    python manage.py collectstatic --noinput
    python manage.py initadmin
fi