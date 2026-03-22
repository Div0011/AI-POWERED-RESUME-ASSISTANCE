#!/bin/bash
# Setup script for GET IT! local development

set -e

echo "🛠️  GET IT! Local Setup Script"
echo "================================"

# Check Python version
python_version=$(python3 --version | awk '{print $2}')
echo "✅ Python version: $python_version"

# Check Node version
node_version=$(node --version)
echo "✅ Node version: $node_version"

# Create virtual environment for backend
echo "📦 Setting up Python virtual environment..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp config/.env.example .env
    echo "⚠️  Please edit .env with your actual values"
fi

# Initialize database
echo "🗄️  Initializing database..."
cd backend
python check_db_schema.py
cd ..

# Start services
echo "🆙 Starting services..."
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   Redis: localhost:6379"
echo "   PostgreSQL: localhost:5432"

echo "✅ Setup complete! Run the following to start development:"
echo "   cd backend && python -m uvicorn main:app --reload"
echo "   cd frontend && npm run dev"
echo "   redis-server"
echo "   celery -A worker worker --loglevel=info"
