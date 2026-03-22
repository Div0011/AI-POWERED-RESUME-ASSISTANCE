# GET IT! Cloudflare Deployment Guide

## Pre-Deployment Checklist

- [ ] All files organized (Backend, Frontend, Database, Config, Docs, Assets)
- [ ] Environment variables configured in `config/.env`
- [ ] Cloudflare account setup (Workers, KV, Zones)
- [ ] SSL certificates ready
- [ ] Docker installed and running
- [ ] Database initialized
- [ ] All tests passing

## Step 1: Prepare Cloudflare

### Create Cloudflare Account & Zone

```bash
# Login to Cloudflare dashboard
# Create new zone for yourdomain.com
# Note: ACCOUNT_ID, ZONE_ID, API_TOKEN
```

### Setup Cloudflare Workers

```bash
npm install -g wrangler
cd config/cloudflare
wrangler login
wrangler publish
```

### Configure KV Namespaces

```bash
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "CONFIG"
```

## Step 2: Configure Environment

```bash
cp config/.env.example .env

# Edit .env with your values:
# - Database credentials
# - API keys (Gemini, Groq, Firebase)
# - Email configuration
# - Cloudflare settings
```

## Step 3: Build & Test Locally

```bash
# Start all services
docker compose -f config/docker/docker-compose.prod.yml build
docker compose -f config/docker/docker-compose.prod.yml up -d

# Run tests
python -m pytest backend/tests/
npm test --prefix frontend

# Health check
curl http://localhost:8000/health
curl http://localhost:3000
```

## Step 4: Deploy to Production

```bash
cd scripts/deploy
chmod +x deploy.sh
./deploy.sh

# Or manual deployment
docker login registry.your-provider.com
docker push your-registry/get-it-frontend:latest
docker push your-registry/get-it-backend:latest
```

## Step 5: Configure DNS & SSL

```
DNS Records for yourdomain.com:

A Record     → Your server IP (for origin)
A Record     → Cloudflare IP (for CDN)
CNAME       api → your-api-backend.com
MX Record   → For email (if needed)
TXT Record  → SPF, DKIM for email
```

## Step 6: Verify Deployment

```bash
# Health checks
curl https://yourdomain.com/health
curl https://api.yourdomain.com/health

# Test API endpoints
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Check Cloudflare metrics
# Dashboard → Analytics
```

## Troubleshooting

### Backend not connecting

```bash
# Check service health
docker compose logs backend
docker compose ps

# Restart services
docker compose restart backend
```

### Frontend not loading

```bash
# Check Next.js build
docker compose logs frontend

# Verify API URL in env vars
grep NEXT_PUBLIC_API_URL .env
```

### Database connection errors

```bash
# Check PostgreSQL
psql $DATABASE_URL -c "SELECT 1"

# Restore from backup
pg_restore backup.sql
```

### Cloudflare Workers failing

```bash
# Check logs
wrangler tail

# Redeploy
cd config/cloudflare && wrangler publish
```

## Post-Deployment Monitoring

Monitor via Cloudflare Dashboard:

- **Analytics** → Traffic, response times, errors
- **Workers** → Analytics, logs, errors
- **Cache** → Hit rates, purge options
- **Security** → WAF rules, DDoS protection

Setup monitoring:

```bash
# Enable Sentry for error tracking
# Setup uptime monitors
# Configure alerting
```

## Updating After Deployment

```bash
# Update code and redeploy
git pull origin main
bash scripts/deploy/deploy.sh

# Database migrations (zero-downtime)
docker exec get-it-backend python -m alembic upgrade head

# Cloudflare Workers update
cd config/cloudflare && wrangler publish
```

## Rollback Procedure

```bash
# Quick rollback to previous version
docker compose pull
docker compose up -d

# If database migration failed
docker exec get-it-backend python -m alembic downgrade -1

# Check git history and revert if needed
git revert <commit-hash>
```
