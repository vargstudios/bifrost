#!/bin/bash

# Build native app
./gradlew build --info \
  -Dquarkus.package.type=native \
  -Dquarkus.native.container-runtime=podman

# Create app image
podman build \
  --file src/main/docker/Dockerfile.ubuntu \
  --tag docker.io/vargstudios/bifrost-worker:latest \
  .
