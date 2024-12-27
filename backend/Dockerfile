FROM python:3.12.3-bullseye

# Set working directory
WORKDIR /code

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install -y postgresql

# Install dependencies
COPY . .

RUN pip install -r requirements.txt

ENTRYPOINT [ "bash", "entrypoint.sh" ]

#CMD [ "daphne", "-p", "8000", "-b", "0.0.0.0", "config.asgi:application" ]
CMD [ "python", "manage.py", "runserver", "0:8000" ]
