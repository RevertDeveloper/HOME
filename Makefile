.PHONY: up down rebuild dev

up:
	docker compose up -d

down:
	docker compose down

rebuild:
	docker compose up -d --build

dev:
	bun run dev -- --port 5202 --strictPort
