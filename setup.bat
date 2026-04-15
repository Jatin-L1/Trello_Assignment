@echo off
REM Trello Clone Setup Script for Windows
REM This script automates the initial setup process

echo ========================================
echo Trello Clone Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js detected
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    exit /b 1
)

echo [OK] npm detected
npm --version
echo.

REM Backend setup
echo Setting up backend...
cd backend

if not exist "package.json" (
    echo [ERROR] backend/package.json not found
    exit /b 1
)

echo Installing backend dependencies...
call npm install

if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
    echo [WARNING] Please edit backend/.env and add your DATABASE_URL
)

cd ..
echo [OK] Backend setup complete
echo.

REM Frontend setup
echo Setting up frontend...
cd frontend

if not exist "package.json" (
    echo [ERROR] frontend/package.json not found
    exit /b 1
)

echo Installing frontend dependencies...
call npm install

if not exist ".env.local" (
    echo Creating .env.local file from example...
    copy .env.local.example .env.local
)

cd ..
echo [OK] Frontend setup complete
echo.

REM Final instructions
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Setup your database:
echo    - Create a Supabase account at https://supabase.com
echo    - Create a new project
echo    - Run the SQL from backend/database/schema.sql
echo    - Run the SQL from backend/database/seed.sql
echo    - Copy your connection string
echo.
echo 2. Configure backend:
echo    - Edit backend/.env
echo    - Set DATABASE_URL to your Supabase connection string
echo.
echo 3. Start the backend:
echo    cd backend
echo    npm run dev
echo.
echo 4. Start the frontend (in a new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
