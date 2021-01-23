#!/bin/bash

# Build native app
./gradlew build --info

# Create app image
podman build \
  --file src/main/docker/Dockerfile.alpine \
  --tag docker.io/vargstudios/bifrost-server:latest \
  .
