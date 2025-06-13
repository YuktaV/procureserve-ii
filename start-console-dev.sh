#!/bin/bash

# ProcureServe II - Console App Development Startup Script
# This script sets up and starts both the console app and customer app with Supabase

echo "🚀 Starting ProcureServe II Console Development Environment..."

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_console() {
    echo -e "${PURPLE}[CONSOLE]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "supabase/supabase/config.toml" ]; then
    print_error "Please run this script from the PSII project root directory"
    exit 1
fi

# Step 1: Ensure Supabase is running
print_status "Checking Supabase status..."
if supabase status > /dev/null 2>&1; then
    print_success "Supabase is already running"
else
    print_status "Starting Supabase..."
    if supabase start; then
        print_success "Supabase started successfully"
    else
        print_error "Failed to start Supabase"
        exit 1
    fi
fi

# Step 2: Verify database is properly set up
print_status "Verifying database setup..."
if node scripts/check-db.js > /dev/null 2>&1; then
    print_success "Database connectivity verified"
else
    print_warning "Database may need setup - continuing anyway"
fi

# Step 3: Install dependencies for both apps
print_status "Installing customer app dependencies..."
cd apps/customer-app
if npm install > /dev/null 2>&1; then
    print_success "Customer app dependencies installed"
else
    print_error "Failed to install customer app dependencies"
    exit 1
fi

print_status "Installing console app dependencies..."
cd ../console-app
if npm install > /dev/null 2>&1; then
    print_success "Console app dependencies installed"
else
    print_error "Failed to install console app dependencies"
    exit 1
fi

# Step 4: Start both applications in background
cd ../..

print_status "Starting Customer App on port 3004..."
cd apps/customer-app
npx vite dev --port 3004 > /dev/null 2>&1 &
CUSTOMER_PID=$!
cd ../..

print_status "Starting Console App on port 3005..."
cd apps/console-app
npx vite dev --port 3005 > /dev/null 2>&1 &
CONSOLE_PID=$!
cd ../..

# Wait a moment for apps to start
sleep 3

# Step 5: Verify applications are running
print_status "Verifying applications are running..."

if curl -s http://localhost:3004 > /dev/null 2>&1; then
    print_success "Customer App is running on http://localhost:3004"
else
    print_warning "Customer App may still be starting..."
fi

if curl -s http://localhost:3005 > /dev/null 2>&1; then
    print_warning "Console App may still be starting..."
else
    print_warning "Console App may still be starting..."
fi

# Step 6: Display status and URLs
echo ""
print_success "✨ ProcureServe II Development Environment is Ready!"
echo ""
print_console "🎛️  Console App: http://localhost:3005"
print_status "📱 Customer App: http://localhost:3004"
print_status "🗄️  Supabase Studio: http://localhost:54323"
print_status "📧 Email Testing: http://localhost:54324"
echo ""
print_warning "Press Ctrl+C to stop all services"
echo ""

# Cleanup function
cleanup() {
    print_status "Shutting down applications..."
    kill $CUSTOMER_PID 2>/dev/null
    kill $CONSOLE_PID 2>/dev/null
    print_status "Stopping Supabase..."
    supabase stop
    print_success "Development environment stopped"
    exit 0
}

# Trap Ctrl+C to run cleanup
trap cleanup INT

# Keep script running and show logs
print_status "Monitoring applications... (Press Ctrl+C to stop)"
while true; do
    sleep 5
    if ! kill -0 $CUSTOMER_PID 2>/dev/null; then
        print_error "Customer App stopped unexpectedly"
        cleanup
    fi
    if ! kill -0 $CONSOLE_PID 2>/dev/null; then
        print_error "Console App stopped unexpectedly"
        cleanup
    fi
done
