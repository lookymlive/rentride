# =============================================================================
# Supabase Migration Runner (PowerShell)
# =============================================================================
# This script runs all Supabase migrations in order
# Usage: .\scripts\run-migrations.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Supabase Migrations..." -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
try {
    supabase --version | Out-Null
} catch {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 Install it with:"
    Write-Host "   npm install -g supabase"
    exit 1
}

# Check if logged in
try {
    supabase projects list | Out-Null
} catch {
    Write-Host "❌ Not logged in to Supabase!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔐 Login with:"
    Write-Host "   supabase login"
    exit 1
}

$PROJECT_ID = "ymbfktjlmzlepjujaxxw"
$MIGRATIONS_DIR = "supabase\migrations"

Write-Host "📊 Project ID: $PROJECT_ID" -ForegroundColor Blue
Write-Host ""

# Function to run a migration
function Run-Migration {
    param (
        [string]$FilePath
    )
    
    $name = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
    
    Write-Host "📝 Running migration: $name" -ForegroundColor Blue
    
    try {
        Get-Content $FilePath | supabase db execute --project-ref $PROJECT_ID
        Write-Host "✅ Success: $name" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "❌ Failed: $name" -ForegroundColor Red
        Write-Host $_.Exception.Message
        exit 1
    }
}

# Run migrations in order
if (Test-Path $MIGRATIONS_DIR) {
    $migrations = Get-ChildItem -Path $MIGRATIONS_DIR -Filter "*.sql" | Sort-Object Name
    
    foreach ($migration in $migrations) {
        Run-Migration -FilePath $migration.FullName
    }
} else {
    Write-Host "❌ Migrations directory not found: $MIGRATIONS_DIR" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 All migrations completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:"
Write-Host "   1. Verify tables in Supabase Dashboard"
Write-Host "   2. Test RLS policies"
Write-Host "   3. Generate TypeScript types: npm run generate-types"
Write-Host "   4. Update environment variables"
