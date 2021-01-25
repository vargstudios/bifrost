#!/bin/bash
set -o errexit
set -o nounset

# Build native app
./gradlew clean
./gradlew build --info

# Create app image
podman build \
  --file src/main/docker/Dockerfile.alpine \
  --tag docker.io/vargstudios/bifrost-server:latest \
  .
