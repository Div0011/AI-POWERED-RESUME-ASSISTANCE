#!/bin/bash
# Deployment script for GET IT! using Cloudflare

set -e

echo "🚀 GET IT! Deployment Script"
echo "================================"

# Check for required environment variables
required_vars=("CLOUDFLARE_API_TOKEN" "CLOUDFLARE_ACCOUNT_ID" "DB_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables verified"

# Build Docker images
echo "🔨 Building Docker images..."
docker compose -f config/docker/docker-compose.prod.yml build

# Start services
echo "🆙 Starting services..."
docker compose -f config/docker/docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose -f config/docker/docker-compose.prod.yml exec -T postgres psql -U $DB_USER -d $DB_NAME < database/migrations/init.sql

# Seed initial data
echo "🌱 Seeding database..."
docker compose -f config/docker/docker-compose.prod.yml exec -T backend python database/seeds/seed_jobs.py

# Deploy to Cloudflare Workers
echo "☁️ Deploying to Cloudflare..."
cd config/cloudflare
wrangler deploy
cd ../../

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://yourdomain.com"
echo "🔌 API: https://api.yourdomain.com"
echo "📊 Health check: https://yourdomain.com/health"
