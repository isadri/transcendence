FROM python:3.12.3-bullseye

# Set working directory
WORKDIR /code

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
COPY . .
RUN pip install -r requirements.txt
