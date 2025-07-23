#!/bin/bash

# n8n Health Check Script
# This script checks if n8n is running and accessible

set -e

N8N_URL="${N8N_URL:-http://localhost:5678}"
TIMEOUT="${TIMEOUT:-30}"

echo "Checking n8n health at $N8N_URL..."

# Check if n8n is responding
if curl -f -s --max-time $TIMEOUT "$N8N_URL/healthz" > /dev/null 2>&1; then
    echo "✅ n8n is healthy and responding"
    exit 0
else
    echo "❌ n8n is not responding or unhealthy"
    
    # Check if container is running
    if docker-compose ps n8n | grep -q "Up"; then
        echo "📋 Container is running, checking logs..."
        docker-compose logs --tail=20 n8n
    else
        echo "📋 Container is not running"
        docker-compose ps
    fi
    
    exit 1
fi
