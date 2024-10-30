
up:
	@docker-compose up

up-with-build:
	@docker-compose up -d --build

down:
	@docker-compose down

re: down up-with-build

exec:
	@docker-compose exec -it back-end $(CMD)

start-app:
	@docker-compose exec -it back-end django-admin startapp $(APPNAME) $(PATH)

makemigrations:
	@docker compose exec -it back-end python manage.py makemigrations $(APPNAME)

migrate:
	@docker-compose exec -it back-end python manage.py migrate $(APPNAME)

miupdate: makemigrations migrate

shell:
	@docker-compose exec -it back-end python manage.py shell

dbshell:
	@docker-compose exec -it back-end python manage.py dbshell

create-superuser:
	@docker-compose exec -it back-end python manage.py createsuperuser

check-style:
	@bash checker.sh
