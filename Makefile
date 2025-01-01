up:
	@docker-compose up
upd:
	@docker-compose up -d

build:
	@docker-compose up --build
buildd:
	@docker-compose up -d --build

down:
	@docker-compose down

re: down build

re-d: down buildd

exec:
	@docker-compose exec -it back-end $(CMD)

start-app:
	@docker-compose exec -it back-end django-admin startapp $(APPNAME) $(PATH)

makemigrations:
	@docker-compose exec -it back-end python manage.py makemigrations $(APPNAME)

migrate:
	@docker-compose exec -it back-end python manage.py migrate $(APPNAME)

shell:
	@docker-compose exec -it back-end python manage.py shell

dbshell:
	@docker-compose exec -it back-end python manage.py dbshell

create-superuser:
	@docker-compose exec -it back-end python manage.py createsuperuser

check-style:
	@bash checker.sh
