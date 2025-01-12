build:
	@docker compose up --build

up:
	@docker compose up

upd:
	@docker compose up -d

buildd:
	@docker compose up -d --build

down:
	@docker compose down

re: down build

re-d: down buildd