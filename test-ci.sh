#!/bin/bash

set -e

echo "Testing CI Workflows Locally"
echo "================================"

echo "Cleaning up existing containers..."
docker compose down -v

echo ""
echo "Testing Backend Workflow..."
echo "--------------------------------"

echo "Building and starting Mongo + Server..."
docker compose up -d --build mongo server

echo "Waiting for services to be ready..."
sleep 10

echo "Running backend tests..."
docker exec server npm test -- --ci --runInBand

echo "Backend tests passed!"

echo "Cleaning up backend services..."
docker compose down

echo ""
echo "Testing Frontend Workflow..."
echo "--------------------------------"

echo "Building and starting Mongo + Server + Client..."
docker compose up -d --build

echo "Waiting for services to be ready..."
sleep 15

echo "Running frontend tests..."
docker exec client npm test -- --run

echo "Frontend tests passed!"

echo "Cleaning up all services..."
docker compose down

echo ""
echo "All CI tests passed successfully!"
