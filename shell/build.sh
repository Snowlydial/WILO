#!/bin/bash
set -e

echo "Building backend..."
cd ../backend
./mvnw clean package -DskipTests

echo "Copying jar to shell..."
mkdir -p ../shell/backend
cp target/wilo-0.0.1.jar ../shell/backend/wilo-0.0.1.jar

echo "Building frontend..."
cd ../frontend
npm run build

echo "Copying frontend build into Spring Boot static..."
rm -rf ../backend/src/main/resources/static/*
cp -r dist/* ../backend/src/main/resources/static/

echo "Rebuilding backend with frontend included..."
cd ../backend
./mvnw clean package -DskipTests
cp target/wilo-0.0.1.jar ../shell/backend/wilo-0.0.1.jar

echo "Building Wails app..."
cd ../shell
wails build

echo "Done. Executable in shell/build/bin/"