up:
	@sudo docker compose up -d

up-with-build:
	@sudo docker compose up -d --build

down:
	@sudo docker compose down

exec:
	@sudo docker compose exec -it back-end $(CMD)

start-app:
	@sudo docker compose exec -it back-end django-admin startapp $(APPNAME)

makemigrations:
	@sudo docker compose exec -it back-end python manage.py makemigrations $(APPNAME)

migrate:
	@sudo docker compose exec -it back-end python manage.py migrate $(APPNAME)

shell:
	@sudo docker compose exec -it back-end python manage.py shell
