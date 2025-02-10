DOCKER_COMPOSE = docker compose
ifeq ($(shell uname),Linux)
	DOCKER_COMPOSE = docker-compose
endif

build:
	@$(DOCKER_COMPOSE) up --build

up:
	@$(DOCKER_COMPOSE) up

upd:
	@$(DOCKER_COMPOSE) up -d

buildd:
	@$(DOCKER_COMPOSE) up -d --build

down:
	@$(DOCKER_COMPOSE) down

re: down build

re-d: down buildd