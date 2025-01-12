FROM python:3.12.3-bullseye

# Set working directory
WORKDIR /code

# Create a non-root user and group
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install -y postgresql

# Install dependencies
COPY . .

RUN chown -R appuser:appgroup /code

RUN pip install -r requirements.txt

# Switch to the non-root user
USER appuser

ENTRYPOINT [ "bash", "entrypoint.sh" ]
