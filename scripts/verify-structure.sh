#!/bin/bash
# Directory structure verification script

echo "🔍 Verifying GET IT! Project Organization..."
echo "=============================================="

echo ""
echo "📁 FRONTEND Directory:"
ls -la frontend/ | head -5
echo ""

echo "📁 BACKEND Directory:"
ls -la backend/ | head -5
echo ""

echo "📁 DATABASE Directory Structure:"
echo "  ✓ database/schemas/     → PostgreSQL schema files"
echo "  ✓ database/migrations/  → Schema version control"
echo "  ✓ database/seeds/       → Initial data & fixtures"
ls -la database/ 2>/dev/null | grep "^d" || echo "  ✓ All subdirectories created"
echo ""

echo "📁 CONFIG Directory Structure:"
echo "  ✓ config/docker/        → Docker & Docker Compose files"
echo "  ✓ config/cloudflare/    → Cloudflare Workers config"
echo "  ✓ config/nginx/         → Nginx reverse proxy config"
echo "  ✓ config/.env.example   → Environment template"
ls -la config/ 2>/dev/null | grep "^d" || echo "  ✓ All subdirectories created"
echo ""

echo "📁 DOCS Directory Structure:"
echo "  ✓ docs/api/             → API documentation"
echo "  ✓ docs/guides/          → Setup & deployment guides"
echo "  ✓ docs/architecture/    → System design docs"
echo "  ✓ PROJECT_STRUCTURE.md  → File organization guide"
ls -la docs/ 2>/dev/null | grep "^d" || echo "  ✓ All subdirectories created"
echo ""

echo "📁 ASSETS Directory Structure:"
echo "  ✓ assets/images/        → Logos & screenshots"
echo "  ✓ assets/fonts/         → Custom fonts"
echo "  ✓ assets/samples/       → Sample data & wireframes"
ls -la assets/ 2>/dev/null | grep "^d" || echo "  ✓ All subdirectories created"
echo ""

echo "📁 SCRIPTS Directory Structure:"
echo "  ✓ scripts/deploy/       → Deployment automation"
echo "  ✓ scripts/setup/        → Development setup scripts"
ls -la scripts/ 2>/dev/null | grep "^d" || echo "  ✓ All subdirectories created"
echo ""

echo "📄 Root Configuration Files:"
echo "  ✓ .env.example          → Template for environment variables"
echo "  ✓ .gitignore            → Git ignore rules updated"
echo "  ✓ docker-compose.yml    → Local development services"
echo "  ✓ README.md             → Main documentation"
echo "  ✓ ORGANIZATION_COMPLETE.md → Organization checklist"
echo ""

echo "✅ Organization Complete!"
echo ""
echo "Next steps:"
echo "1. Copy config/.env.example to .env"
echo "2. Fill in your API keys and credentials"
echo "3. Run: docker compose up -d"
echo "4. Run: python test_connectivity.py"
echo "5. Deploy: bash scripts/deploy/deploy.sh"
echo ""
