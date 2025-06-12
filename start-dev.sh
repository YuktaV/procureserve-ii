#!/bin/bash

# ProcureServe II - Development Startup Script
# This script sets up and starts the application for testing

echo "🚀 Starting ProcureServe II Development Environment..."

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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

# Check if we're in the right directory
if [ ! -f "supabase/supabase/config.toml" ]; then
    print_error "Please run this script from the PSII project root directory"
    exit 1
fi

# Step 1: Start Supabase
print_status "Starting Supabase..."
if supabase start; then
    print_success "Supabase started successfully"
else
    print_error "Failed to start Supabase"
    print_warning "Try: supabase stop && supabase start"
    exit 1
fi

# Step 2: Apply database migrations
print_status "Applying database migrations..."
if supabase migration up; then
    print_success "Database migrations applied"
else
    print_error "Failed to apply migrations"
    print_warning "Try: supabase db reset && supabase migration up"
    exit 1
fi

# Step 3: Check if seed data should be applied
read -p "Apply seed data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Applying seed data..."
    supabase db reset --debug
    print_success "Seed data applied"
fi

# Step 4: Install dependencies
print_status "Installing customer app dependencies..."
cd apps/customer-app
if npm install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 5: Check environment variables
print_status "Checking environment configuration..."
if [ -f ".env.local" ]; then
    print_success "Environment file found"
    echo "Supabase URL: $(grep PUBLIC_SUPABASE_URL .env.local)"
else
    print_error "Missing .env.local file"
    exit 1
fi

# Step 6: Start the development server
print_status "Starting development server..."
echo ""
print_success "✨ Setup complete! Starting ProcureServe II..."
echo ""
print_warning "📱 Application will be available at: http://localhost:3000"
print_warning "🎛️  Supabase Studio available at: http://localhost:54333"
print_warning "📧 Email testing available at: http://localhost:54324"
echo ""
print_status "Press Ctrl+C to stop the development server"
echo ""

# Start the app
npm run dev

# Cleanup function
cleanup() {
    print_status "Shutting down..."
    print_status "Stopping Supabase..."
    cd ../..
    supabase stop
    print_success "Development environment stopped"
}

# Trap Ctrl+C to run cleanup
trap cleanup INT

# Keep script running
wait
