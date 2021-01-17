#!/bin/bash

# Create builder image with support for static linking
podman build \
  --file src/main/docker/Dockerfile.native-image \
  --tag localhost/native-image:custom \
  .

# Build native app
# Static is required because alpine uses musl-libc instead of glibc
./gradlew build --info \
  -Dquarkus.package.type=native \
  -Dquarkus.native.container-runtime=podman \
  -Dquarkus.native.builder-image=localhost/native-image:custom \
  -Dquarkus.native.additional-build-args=--static

# Create app image
podman build \
  --file src/main/docker/Dockerfile.alpine \
  --tag docker.io/vargstudios/bifrost-worker:latest \
  .
