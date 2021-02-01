build:
	docker build --tag vservice:latest .
dev:
	docker-compose --file docker-compose-dev.yml up --force-recreate v-service
db:
	docker-compose --file docker-compose-dev.yml up --force-recreate v-postgres
swarm: build
	docker stack deploy --compose-file docker-compose-swarm.yml vservice
clean:
	docker image rm vservice service_v-service --force
