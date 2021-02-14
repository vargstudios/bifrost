#!/bin/bash
set -o errexit
set -o nounset

# Build jvm app
./gradlew clean
./gradlew build --info -Dquarkus.package.type=jar

# Create app image
podman build \
  --file src/main/docker/Dockerfile.alpine-jvm \
  --tag docker.io/vargstudios/bifrost-server:latest \
  .
