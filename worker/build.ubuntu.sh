#!/bin/bash

# Build native app
./gradlew build --info

# Create app image
podman build \
  --file src/main/docker/Dockerfile.ubuntu \
  --tag docker.io/vargstudios/bifrost-worker:latest \
  .
