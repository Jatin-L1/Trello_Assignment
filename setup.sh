#!/bin/bash

# Trello Clone Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Trello Clone Setup Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) detected${NC}"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ backend/package.json not found${NC}"
    exit 1
fi

echo "Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your DATABASE_URL${NC}"
fi

cd ..
echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ frontend/package.json not found${NC}"
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from example..."
    cp .env.local.example .env.local
fi

cd ..
echo -e "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Final instructions
echo "=============================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Setup your database:"
echo "   - Create a Supabase account at https://supabase.com"
echo "   - Create a new project"
echo "   - Run the SQL from backend/database/schema.sql"
echo "   - Run the SQL from backend/database/seed.sql"
echo "   - Copy your connection string"
echo ""
echo "2. Configure backend:"
echo "   - Edit backend/.env"
echo "   - Set DATABASE_URL to your Supabase connection string"
echo ""
echo "3. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
