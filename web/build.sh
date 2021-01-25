#!/bin/bash
set -o errexit
set -o nounset

# Build web
yarn
yarn clean
yarn build

# Copy to server
SOURCES=dist/*
TARGET=../server/src/main/resources/META-INF/resources
rm -rf $TARGET
mkdir -p $TARGET
cp $SOURCES $TARGET
