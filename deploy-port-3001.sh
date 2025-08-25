#!/bin/bash

# CR-Finder AI Deployment Script for Port 3001
# This script deploys both the web app and marketing app on port 3001

echo "🚀 Deploying CR-Finder AI apps to port 3001..."

# Check if port 3001 is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3001 is already in use. Please stop any services using this port first."
    echo "   You can check what's using the port with: lsof -i :3001"
    exit 1
fi

# Build both applications
echo "📦 Building applications..."
cd apps/web && npm run build && cd ../..
cd apps/marketing && npm run build && cd ../..

# Start both applications in the background
echo "🌐 Starting web app on port 3001..."
cd apps/web && npm run start &
WEB_PID=$!

echo "📢 Starting marketing app on port 3001..."
cd apps/marketing && npm run start &
MARKETING_PID=$!

# Wait a moment for apps to start
sleep 5

# Check if both apps are running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Successfully deployed to port 3001!"
    echo ""
    echo "🌐 Web App: http://localhost:3001"
    echo "📢 Marketing Site: http://localhost:3001 (marketing app)"
    echo ""
    echo "📋 Process IDs:"
    echo "   Web App: $WEB_PID"
    echo "   Marketing: $MARKETING_PID"
    echo ""
    echo "🛑 To stop both apps, run: kill $WEB_PID $MARKETING_PID"
    echo "   Or use: pkill -f 'next start -p 3001'"
else
    echo "❌ Failed to start applications on port 3001"
    echo "   Stopping processes..."
    kill $WEB_PID $MARKETING_PID 2>/dev/null
    exit 1
fi

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Stopping applications..."; kill $WEB_PID $MARKETING_PID 2>/dev/null; echo "✅ Applications stopped"; exit 0' INT TERM

echo "🔄 Applications are running. Press Ctrl+C to stop."
wait
