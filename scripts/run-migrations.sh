#!/bin/bash

# =============================================================================
# Supabase Migration Runner
# =============================================================================
# This script runs all Supabase migrations in order
# Usage: ./scripts/run-migrations.sh

set -e  # Exit on error

echo "🚀 Starting Supabase Migrations..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found!${NC}"
    echo ""
    echo "📦 Install it with:"
    echo "   npm install -g supabase"
    echo "   or"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Supabase!${NC}"
    echo ""
    echo "🔐 Login with:"
    echo "   supabase login"
    exit 1
fi

PROJECT_ID="ymbfktjlmzlepjujaxxw"
MIGRATIONS_DIR="supabase/migrations"

echo -e "${BLUE}📊 Project ID: ${PROJECT_ID}${NC}"
echo ""

# Function to run a migration
run_migration() {
    local file=$1
    local name=$(basename "$file" .sql)
    
    echo -e "${BLUE}📝 Running migration: ${name}${NC}"
    
    if supabase db execute --project-ref "$PROJECT_ID" < "$file"; then
        echo -e "${GREEN}✅ Success: ${name}${NC}"
        echo ""
    else
        echo -e "${RED}❌ Failed: ${name}${NC}"
        exit 1
    fi
}

# Run migrations in order
if [ -d "$MIGRATIONS_DIR" ]; then
    for migration in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$migration" ]; then
            run_migration "$migration"
        fi
    done
else
    echo -e "${RED}❌ Migrations directory not found: ${MIGRATIONS_DIR}${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All migrations completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Verify tables in Supabase Dashboard"
echo "   2. Test RLS policies"
echo "   3. Generate TypeScript types: npm run generate-types"
echo "   4. Update environment variables"
