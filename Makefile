.PHONY: build push test

DOCKER_IMAGE=bepeho/docker-bepeho-ui-local
	
build:
	docker volume create assets
	docker build -t ${DOCKER_IMAGE} .

buildforce:
	docker build --no-cache -t ${DOCKER_IMAGE} .

dev: build
	docker run -i --network host --entrypoint=/bin/sh  ${DOCKER_IMAGE}
	
push: build
	docker push ${DOCKER_IMAGE}:latest

test: build

	docker run --rm -i -v openstreetmap-data:/var/lib/postgresql/12/main -p 80:80 -d ${DOCKER_IMAGE} run

run: build
	docker volume create openstreetmap-data
	docker run --rm -v openstreetmap-data:/var/lib/postgresql/12/main -p 80:80 -d ${DOCKER_IMAGE} run
	
stop:
	docker rm -f `docker ps | grep '${DOCKER_IMAGE}' | awk '{ print $$1 }'` || true
	docker volume rm -f openstreetmap-data
stopall:
	docker stop `docker ps -a -q`
	docker rm -f `docker ps -a -q`
