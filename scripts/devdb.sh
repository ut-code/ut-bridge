#!/usr/bin/env bash

CONTAINER="utbridge_postgres"

set -eu

docker stop $CONTAINER 2>/dev/null || true
docker run \
	--detach \
  --rm \
  --name $CONTAINER \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=user \
  -e POSTGRES_DB=database \
  postgres:alpine

  
until docker exec $CONTAINER pg_isready -U user -d database
do
	sleep 1
done

echo '[devdb] PostgreSQL is ready.'

