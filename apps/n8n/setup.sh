#!/bin/bash

# n8n Setup Script
# This script helps with initial setup of the n8n instance

set -e

echo "🚀 Setting up n8n..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please review and customize it as needed."
else
    echo "✅ .env file already exists"
fi

# Pull the latest n8n image
echo "📦 Pulling latest n8n Docker image..."
docker-compose pull

# Start n8n
echo "🔄 Starting n8n..."
docker-compose up -d

# Wait for n8n to be ready
echo "⏳ Waiting for n8n to be ready..."
sleep 10

# Check health
if curl -f -s --max-time 30 "http://localhost:5678/healthz" > /dev/null 2>&1; then
    echo "✅ n8n is running successfully!"
    echo "🌐 Access n8n at: http://localhost:5678"
    echo "📚 Check the README.md for more information"
else
    echo "⚠️  n8n might still be starting up. Check logs with: bun run logs"
fi

echo "🎉 Setup complete!"
