build:
	docker build --tag tel-boot-service:latest .
dev:
	docker-compose --file docker-compose-dev.yml up --force-recreate tel-boot-service
swarm: build
	docker stack deploy --compose-file docker-compose-swarm.yml tel-boot
clean:
	docker image rm vservice service_v-service --force
