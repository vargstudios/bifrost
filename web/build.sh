#!/bin/bash

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
