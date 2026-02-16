#!/bin/bash

echo "================================================"
echo "  Starting Spelling Bee & Reading Coach App"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/4] Checking dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
fi

cd ../client
if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
fi

cd ..

echo ""
echo "[2/4] Checking environment configuration..."
if [ ! -f "server/.env" ]; then
    echo "WARNING: No .env file found in server directory!"
    echo "Please copy server/.env.example to server/.env"
    echo "and add your OpenAI API key."
    exit 1
fi

echo ""
echo "[3/4] Starting backend server..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

echo ""
echo "[4/4] Starting frontend client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "================================================"
echo "  Application is starting!"
echo "================================================"
echo ""
echo "Server: http://localhost:3001"
echo "Client: http://localhost:3000"
echo ""
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
