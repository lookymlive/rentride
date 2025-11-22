# 🚀 Supabase Backend Setup Guide

## Complete Professional Backend Configuration for RentRide

This guide walks you through setting up a production-ready Supabase backend for the RentRide car rental platform.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Migration](#database-migration)
4. [Security Configuration](#security-configuration)
5. [Environment Variables](#environment-variables)
6. [Testing & Verification](#testing--verification)
7. [Production Deployment](#production-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Accounts & Tools

- ✅ [Supabase Account](https://supabase.com) (Free tier available)
- ✅ Node.js >= 18.18.0
- ✅ Git
- ✅ Code editor (VS Code recommended)

### Existing Project

- ✅ Supabase Project: **rentalscar** (ID: `ymbfktjlmzlepjujaxxw`)
- ✅ Organization: **rentalscar**
- ✅ Region: **us-east-1**
- ✅ Status: **ACTIVE_HEALTHY**

---

## 🏗️ Project Setup

### 1. Access Your Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **rentalscar**
3. Navigate to **SQL Editor**

### 2. Verify Database Connection

```sql
-- Test connection
SELECT version();
SELECT current_database();
```

---

## 🗄️ Database Migration

### Migration Order

Execute the following SQL files **in order** through the Supabase SQL Editor:

#### Migration 1: Initial Schema (Required)

**File:** `supabase/migrations/20250118000001_initial_schema.sql`

**What it does:**
- Creates all base tables (countries, regions, users, providers, cars, bookings, reviews)
- Adds initial country and region data
- Sets up foreign key relationships
- Creates indexes for performance
- Adds data validation constraints

**How to run:**
1. Open SQL Editor in Supabase Dashboard
2. Copy entire contents of `20250118000001_initial_schema.sql`
3. Paste into SQL Editor
4. Click **Run**
5. Verify: Check "Success" message

**Verification:**
```sql
-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return: bookings, cars, countries, providers, regions, reviews, users
```

---

#### Migration 2: RLS Policies (Required)

**File:** `supabase/migrations/20250118000002_rls_policies.sql`

**What it does:**
- Enables Row Level Security on all tables
- Creates access policies for users and providers
- Implements secure data isolation
- Adds helper functions for role checking

**How to run:**
1. Copy contents of `20250118000002_rls_policies.sql`
2. Paste into SQL Editor
3. Click **Run**

**Verification:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

#### Migration 3: Functions & Triggers (Required)

**File:** `supabase/migrations/20250118000003_functions_triggers.sql`

**What it does:**
- Creates business logic functions
- Implements automatic triggers
- Adds car availability checking
- Sets up booking validation
- Creates search functionality

**How to run:**
1. Copy contents of `20250118000003_functions_triggers.sql`
2. Paste into SQL Editor
3. Click **Run**

**Verification:**
```sql
-- Check functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Test availability function
SELECT check_car_availability(1, CURRENT_DATE, CURRENT_DATE + 7);
```

---

#### Migration 4: Views & Indexes (Recommended)

**File:** `supabase/migrations/20250118000004_views_indexes.sql`

**What it does:**
- Creates materialized views for performance
- Adds full-text search indexes
- Implements composite indexes
- Creates analytical views

**How to run:**
1. Copy contents of `xxxxxxxxxxx_views_indexes.sql`
2. Paste into SQL Editor
3. Click **Run**

**Verification:**
```sql
-- Check materialized views
SELECT schemaname, matviewname 
FROM pg_matviews 
WHERE schemaname = 'public';

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

### Optional: Seed Data (Development Only)

**File:** `supabase/seed/seed_data.sql`

**What it does:**
- Adds additional regions
- Provides sample data templates
- Includes utility functions for testing

**⚠️ Warning:** Only use in development. Remove sample data before production.

---

## 🔐 Security Configuration

### 1. Authentication Settings

Navigate to: **Authentication → Settings**

**Email Auth:**
- ✅ Enable email provider
- ✅ Enable email confirmations
- ✅ Set confirmation URL: `https://yourdomain.com/auth/callback`

**Site URL:**
```
Development: http://localhost:3000
Production: https://yourdomain.com
```

**Redirect URLs:**
```
http://localhost:3000/**
https://yourdomain.com/**
```

### 2. Email Templates

Navigate to: **Authentication → Email Templates**

Customize:
- ✉️ Confirmation email
- 🔑 Password recovery
- 📧 Email change confirmation

### 3. API Keys

Navigate to: **Settings → API**

Copy these keys:
- 🔓 **anon/public key** - For client-side use
- 🔒 **service_role key** - For server-side admin operations (keep secret!)

---

## 🔧 Environment Variables

### Update `.env.local`

```env
# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://ymbfktjlmzlepjxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For admin operations (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Get Your Keys

1. Go to **Settings → API** in Supabase Dashboard
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (optional)

---

## ✅ Testing & Verification

### 1. Test Database Connection

```typescript
// Test in your app or create a test file
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Test query
const { data, error } = await supabase
  .from('countries')
  .select('*')
  .limit(5)

console.log('Countries:', data)
```

### 2. Test Authentication

```typescript
// Sign up test
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'securepassword123'
})
```

### 3. Test RLS Policies

```sql
-- Test as anonymous user
SELECT * FROM cars WHERE status = 'available';
-- Should work

SELECT * FROM users;
-- Should return empty (no access without auth)
```

### 4. Test Functions

```sql
-- Test car search
SELECT * FROM search_cars(
  p_country_id := 1,
  p_min_price := 30,
  p_max_price := 100,
  p_limit := 10
);

-- Test availability
SELECT check_car_availability(1, '2025-01-20', '2025-01-25');
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] All migrations executed successfully
- [ ] RLS policies tested and verified
- [ ] Authentication configured
- [ ] Email templates customized
- [ ] Environment variables set
- [ ] API keys secured
- [ ] Backup strategy configured
- [ ] Monitoring enabled

### Database Optimization

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Refresh materialized views
SELECT refresh_all_materialized_views();

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Performance Settings

Navigate to: **Settings → Database**

Recommended settings:
- **Connection pooling:** Enabled
- **Statement timeout:** 60000ms
- **Idle timeout:** 600s

---

## 📊 Monitoring & Maintenance

### 1. Database Monitoring

Navigate to: **Database → Logs**

Monitor:
- Slow queries
- Connection errors
- RLS policy violations
- Failed authentication attempts

### 2. Regular Maintenance Tasks

**Daily:**
- Check error logs
- Monitor active connections
- Review failed queries

**Weekly:**
- Refresh materialized views
- Check table sizes
- Review index usage

**Monthly:**
- Analyze query performance
- Update statistics
- Review and optimize slow queries
- Check backup integrity

### 3. Refresh Materialized Views

```sql
-- Manual refresh (run weekly or as needed)
SELECT refresh_all_materialized_views();

-- Or individually
SELECT refresh_popular_cars();
SELECT refresh_provider_rankings();
```

### 4. Backup Strategy

Supabase provides automatic daily backups. Additional recommendations:

- Enable Point-in-Time Recovery (PITR) for Pro plan
- Export schema regularly
- Document all custom functions and triggers
- Keep migration files in version control

---

## 🔍 Troubleshooting

### Common Issues

**Issue: Migration fails with "relation already exists"**
```sql
-- Solution: Drop and recreate (development only!)
DROP TABLE IF EXISTS table_name CASCADE;
-- Then re-run migration
```

**Issue: RLS blocks all queries**
```sql
-- Solution: Check if user is authenticated
SELECT auth.uid(); -- Should return UUID, not NULL

-- Temporarily disable RLS for testing (development only!)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

**Issue: Slow queries**
```sql
-- Solution: Check query plan
EXPLAIN ANALYZE
SELECT * FROM cars WHERE status = 'available';

-- Add missing indexes
CREATE INDEX idx_name ON table_name(column_name);
```

**Issue: Connection timeout**
- Check connection pooling settings
- Verify network connectivity
- Review active connections in dashboard

---

## 📚 Additional Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Tools
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Database.dev](https://database.dev) - Schema visualization
- [pgAdmin](https://www.pgadmin.org/) - Database management

### Support
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

## 🎯 Next Steps

1. ✅ Complete all migrations
2. ✅ Configure authentication
3. ✅ Set environment variables
4. ✅ Test all functionality
5. ✅ Generate TypeScript types
6. ✅ Deploy to production
7. ✅ Set up monitoring
8. ✅ Configure backups

---

## 📝 Migration Status Tracker

| Migration | Status | Date | Notes |
|-----------|--------|------|-------|
| 001 - Initial Schema | ⏳ Pending | - | Base tables and data |
| 002 - RLS Policies | ⏳ Pending | - | Security policies |
| 003 - Functions & Triggers | ⏳ Pending | - | Business logic |
| 004 - Views & Indexes | ⏳ Pending | - | Performance optimization |
| Seed Data | ⏳ Optional | - | Development only |

**Legend:**
- ⏳ Pending
- ✅ Complete
- ❌ Failed
- ⚠️ Needs Review

---

**Last Updated:** January 18, 2025  
**Version:** 1.0.0  
**Maintainer:** RentRide Development Team Lookym
