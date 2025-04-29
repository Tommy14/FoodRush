#!/bin/bash

# ==============================
#   Auto Build + Push + Restart
# ==============================
services=(
  "user-auth-service"
  "restaurant-service"
  "order-service"
  "delivery-service"
  "payment-service"
  "location-service"
  "notification-service"
)

# DockerHub username
dockerhub_username="foodrush48"

# Kubernetes namespace
namespace="foodrush"

echo "Starting rebuild + push + rollout restart for all services..."

for service in "${services[@]}"; do
  echo ""
  echo "Building $service..."
  docker build -t $dockerhub_username/foodrush-$service:latest ./backend/$service

  echo "Pushing $service to DockerHub..."
  docker push $dockerhub_username/foodrush-$service:latest

  echo "Restarting Kubernetes deployment for $service..."
  kubectl rollout restart deployment/${service%-service}-deployment -n $namespace
done

echo ""
echo "All services rebuilt, pushed, and restarted successfully!"