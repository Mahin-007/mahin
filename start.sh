#!/bin/bash
# Current Affairs Analyst - Startup Script

set -e

echo "🗞️  Current Affairs Analyst"
echo "================================"

# Check for .env
if [ ! -f ".env" ]; then
  echo "⚠️  No .env file found. Creating from template..."
  cp .env.example .env
  echo "📝 Please add your ANTHROPIC_API_KEY to .env before starting"
  echo "   Get your key at: https://console.anthropic.com"
  exit 1
fi

source .env

if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your_anthropic_api_key_here" ]; then
  echo "❌ Please set ANTHROPIC_API_KEY in .env"
  exit 1
fi

# Install deps if needed
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm install --prefix backend
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install --prefix frontend
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend && npm run build && cd ..

echo ""
echo "✅ Ready! Starting server..."
echo "🌐 Open http://localhost:3001 (after building) or http://localhost:5173 (dev)"
echo ""

# Start backend
cd backend && ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node server.js
