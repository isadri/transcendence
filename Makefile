up:
	@docker compose up -d

up-with-build:
	@docker compose up -d --build

down:
	@docker compose down

exec:
	@docker compose exec -it back-end $(CMD)

start-app:
	@docker compose exec -it back-end django-admin startapp $(APPNAME)

makemigrations:
	@docker compose exec -it back-end python manage.py makemigrations $(APPNAME)

migrate:
	@docker compose exec -it back-end python manage.py migrate $(APPNAME)

shell:
	@docker compose exec -it back-end python manage.py shell
