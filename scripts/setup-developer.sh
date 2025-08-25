#!/bin/bash

echo "🚀 Setting up developer environment for CRE Finder AI..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Supabase is running
echo "🔍 Checking Supabase status..."
if ! supabase status > /dev/null 2>&1; then
    echo "⚠️  Supabase is not running. Starting it now..."
    cd apps/api
    supabase start
    cd ../..
else
    echo "✅ Supabase is already running"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
    echo "📦 Installing tsx for script execution..."
    npm install -g tsx
fi

# Run database seed
echo "🌱 Seeding developer data..."
if npm run db:seed; then
    echo "✅ Developer data seeded successfully"
else
    echo "❌ Failed to seed developer data"
    echo "💡 Try running 'npm run db:seed' manually to see detailed error messages"
    exit 1
fi

echo ""
echo "🎉 Developer environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Navigate to: http://localhost:3001/auth/signin"
echo "3. Login with:"
echo "   Email: dev@example.com"
echo "   Password: devpassword123"
echo ""
echo "🔗 Quick links:"
echo "- Dashboard: http://localhost:3001/dashboard"
echo "- VAPI Test: http://localhost:3001/vapi-test"
echo "- Twilio Test: http://localhost:3001/twilio-test"
echo ""
echo "🚀 Starting development server..."
npm run dev
