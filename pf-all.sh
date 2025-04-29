#!/bin/bash

# Function to auto-restart port-forward
port_forward() {
  local svc_name=$1
  local local_port=$2
  local remote_port=$3

  while true; do
    echo "Starting port-forward for $svc_name..."
    kubectl port-forward service/$svc_name $local_port:$remote_port -n foodrush
    echo "Port-forward for $svc_name crashed. Restarting in 5 seconds..."
    sleep 5
  done
}

# Start port-forward for each service in the background
port_forward user-auth-service 9000 9000 &
port_forward restaurant-service 9100 9100 &
port_forward order-service 9200 9200 &
port_forward delivery-service 9300 9300 &
port_forward payment-service 9400 9400 &
port_forward location-service 9500 9500 &
port_forward notification-service 9800 9800 &

# Wait to keep the script running
wait