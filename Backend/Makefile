SHELL := /bin/bash

install:
	pip install -r requirements.txt

run:
	python manage.py runserver [::]:8001

lint:
	./scripts/run-linters.sh

load:
	python manage.py loaddata ./fixtures/*

test:
	python manage.py test

migration:
	python manage.py makemigrations

migrate:
	python manage.py migrate

superuser:
	python manage.py createsuperuser

heroku:
	git push heroku master

deploy:
	docker-compose build
	docker-compose up -d

down:
	docker-compose down
