FROM python:3.12.3-bullseye

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install -y postgresql

# Install dependencies
COPY . .
RUN pip install -r requirements.txt
