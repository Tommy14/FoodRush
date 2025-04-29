#!/bin/bash

# ===============================
# Free all ports by killing kubectl port-forward
# ===============================

echo "Killing all kubectl port-forward processes to free ports..."

# Kill all port-forward processes
pkill -f "kubectl port-forward"
pkill -f pf-all.sh

echo "All ports are now freed!"