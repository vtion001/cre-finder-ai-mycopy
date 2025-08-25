#!/bin/bash

# CR-Finder AI Development Script for Port 3001
# This script runs both the web app and marketing app in development mode on port 3001

echo "🚀 Starting CR-Finder AI apps in development mode on port 3001..."

# Check if port 3001 is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3001 is already in use. Please stop any services using this port first."
    echo "   You can check what's using the port with: lsof -i :3001"
    exit 1
fi

# Start both applications in development mode
echo "🌐 Starting web app in development mode on port 3001..."
cd apps/web && npm run dev &
WEB_PID=$!

echo "📢 Starting marketing app in development mode on port 3001..."
cd apps/marketing && npm run dev &
MARKETING_PID=$!

# Wait a moment for apps to start
sleep 5

# Check if both apps are running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Successfully started development servers on port 3001!"
    echo ""
    echo "🌐 Web App: http://localhost:3001"
    echo "📢 Marketing Site: http://localhost:3001 (marketing app)"
    echo ""
    echo "📋 Process IDs:"
    echo "   Web App: $WEB_PID"
    echo "   Marketing: $MARKETING_PID"
    echo ""
    echo "🛑 To stop both apps, run: kill $WEB_PID $MARKETING_PID"
    echo "   Or use: pkill -f 'next dev -p 3001'"
    echo ""
    echo "🔄 Development servers are running. Press Ctrl+C to stop."
else
    echo "❌ Failed to start development servers on port 3001"
    echo "   Stopping processes..."
    kill $WEB_PID $MARKETING_PID 2>/dev/null
    exit 1
fi

# Keep script running and handle cleanup on exit
trap 'echo ""; echo "🛑 Stopping development servers..."; kill $WEB_PID $MARKETING_PID 2>/dev/null; echo "✅ Development servers stopped"; exit 0' INT TERM

wait
