@echo off
echo ================================================
echo   Starting Spelling Bee & Reading Coach App
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking dependencies...
cd server
if not exist "node_modules\" (
    echo Installing server dependencies...
    call npm install
)

cd ..\client
if not exist "node_modules\" (
    echo Installing client dependencies...
    call npm install
)

cd ..

echo.
echo [2/4] Checking environment configuration...
if not exist "server\.env" (
    echo WARNING: No .env file found in server directory!
    echo Please copy server\.env.example to server\.env
    echo and add your OpenAI API key.
    pause
    exit /b 1
)

echo.
echo [3/4] Starting backend server...
start "Spelling Bee Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [4/4] Starting frontend client...
start "Spelling Bee Client" cmd /k "cd client && npm run dev"

echo.
echo ================================================
echo   Application is starting!
echo ================================================
echo.
echo Server: http://localhost:3001
echo Client: http://localhost:3000
echo.
echo Two terminal windows will open.
echo Keep them running while using the app.
echo.
echo Press any key to open the app in your browser...
pause >nul

start http://localhost:3000

echo.
echo To stop the app, close both terminal windows.
echo.
