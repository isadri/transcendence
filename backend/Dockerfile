FROM python:3.13.0b2-bookworm

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
