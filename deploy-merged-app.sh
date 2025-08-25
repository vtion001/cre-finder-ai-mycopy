#!/bin/bash

# CR-Finder AI Merged App Deployment Script
# This script deploys the merged web app and marketing site on port 3001

echo "🚀 Deploying CR-Finder AI Merged App to port 3001..."

# Check if port 3001 is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3001 is already in use. Please stop any services using this port first."
    echo "   You can check what's using the port with: lsof -i :3001"
    exit 1
fi

# Navigate to web app directory
cd apps/web

# Start the merged application in development mode
echo "🌐 Starting merged web app and marketing site on port 3001..."
bun run dev &
APP_PID=$!

# Wait a moment for app to start
sleep 8

# Check if app is running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Successfully deployed merged app to port 3001!"
    echo ""
    echo "🌐 Merged App: http://localhost:3001"
    echo "📢 Marketing Site: http://localhost:3001/en"
    echo "🔧 Dashboard: http://localhost:3001/en/dashboard"
    echo ""
    echo "📋 Process ID: $APP_PID"
    echo ""
    echo "🛑 To stop the app, run: kill $APP_PID"
    echo "   Or use: pkill -f 'next dev -p 3001'"
    echo ""
    echo "🔄 Application is running. Press Ctrl+C to stop."
else
    echo "❌ Failed to start application on port 3001"
    echo "   Stopping process..."
    kill $APP_PID 2>/dev/null
    exit 1
fi

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Stopping merged application..."; kill $APP_PID 2>/dev/null; echo "✅ Application stopped"; exit 0' INT TERM

wait
