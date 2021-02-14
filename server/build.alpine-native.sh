#!/bin/bash
set -o errexit
set -o nounset

# Build native app
./gradlew clean
./gradlew build --info -Dquarkus.package.type=native

# Create app image
podman build \
  --file src/main/docker/Dockerfile.alpine-native \
  --tag docker.io/vargstudios/bifrost-server:latest \
  .
