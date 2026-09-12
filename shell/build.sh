#!/bin/bash
set -e

echo "Building backend..."
cd ../backend
./mvnw clean package -DskipTests

echo "Building frontend..."
cd ../frontend
npm run build

echo "Copying frontend build into Spring Boot static..."
rm -rf ../backend/src/main/resources/static/*
cp -r dist/* ../backend/src/main/resources/static/

echo "Rebuilding backend with frontend included..."
cd ../backend
./mvnw clean package -DskipTests

echo "Building Wails app..."
cd ../shell
wails build

echo "Copying jar next to the built executable..."
cp ../backend/target/wilo-0.0.1.jar build/bin/wilo-0.0.1.jar

echo "Done. Executable + jar are together in shell/build/bin/"