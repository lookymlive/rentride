# 🗄️ Supabase Backend Configuration

## Overview

This directory contains all the database migrations, functions, and configuration for the RentRide Supabase backend.

## 📁 Directory Structure

```
supabase/
├── migrations/           # Database migrations (run in order)
│   ├── 20250118000001_initial_schema.sql
│   ├── 20250118000002_rls_policies.sql
│   ├── 20250118000003_functions_triggers.sql
│   └── 20250118000004_views_indexes.sql
├── functions/           # Edge Functions (Deno)
├── seed/               # Seed data for development
│   └── seed_data.sql
└── README.md           # This file
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Supabase account ([Sign up](https://supabase.com))
- Supabase project created
- Database access credentials

### 2. Run Migrations

Execute migrations in order through the Supabase SQL Editor:

#### Step 1: Initial Schema
```bash
# Run: 20250118000001_initial_schema.sql
```
Creates all base tables:
- `countries` - Country reference data
- `regions` - Regional divisions
- `users` - Customer profiles
- `providers` - Car rental companies
- `cars` - Vehicle inventory
- `bookings` - Rental bookings
- `reviews` - User reviews

#### Step 2: RLS Policies
```bash
# Run: 20250118000002_rls_policies.sql
```
Implements Row Level Security:
- User access control
- Provider permissions
- Public read policies
- Secure data isolation

#### Step 3: Functions & Triggers
```bash
# Run: 20250118000003_functions_triggers.sql
```
Business logic automation:
- `check_car_availability()` - Date range validation
- `update_car_status_on_booking()` - Auto status updates
- `validate_booking()` - Booking constraints
- `generate_car_slug()` - SEO-friendly URLs
- `get_provider_stats()` - Analytics
- `search_cars()` - Advanced search

#### Step 4: Views & Indexes
```bash
# Run: 20250118000004_views_indexes.sql
```
Performance optimization:
- Materialized views for popular data
- Full-text search indexes
- Composite indexes for common queries

### 3. Seed Data (Optional)

For development/testing:
```bash
# Run: seed/seed_data.sql
```

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies:

**Users:**
- ✅ Can view/edit own profile
- ✅ Providers can view users who booked their cars

**Providers:**
- ✅ Can view/edit own profile
- ✅ Public profiles viewable by all

**Cars:**
- ✅ Anyone can view available cars
- ✅ Providers can manage own cars
- ✅ Users can view cars they booked

**Bookings:**
- ✅ Users can view/create own bookings
- ✅ Providers can view/update bookings for their cars

**Reviews:**
- ✅ Public read access
- ✅ Users can review completed bookings
- ✅ Users can edit own reviews

### Authentication

Uses Supabase Auth with:
- Email/password authentication
- Email verification
- Password recovery
- JWT tokens

## 📊 Database Schema

### Key Relationships

```
auth.users (Supabase Auth)
    ├── users (customers)
    └── providers (car rental companies)
        └── cars
            ├── bookings
            │   └── users (FK)
            └── reviews
                └── users (FK)
```

### Status Flows

**Car Status:**
- `available` → `pending` → `booked` → `available`
- `maintenance` → `available`
- `inactive` (soft delete)

**Booking Status:**
- `pending` → `approved` → `completed`
- `pending` → `rejected`
- `pending`/`approved` → `cancelled`

## 🔧 Useful Functions

### Check Car Availability
```sql
SELECT check_car_availability(
  car_id := 1,
  pickup_date := '2025-01-20',
  return_date := '2025-01-25'
);
```

### Search Cars
```sql
SELECT * FROM search_cars(
  p_country_id := 1,
  p_region_id := 2,
  p_min_price := 30,
  p_max_price := 100,
  p_car_type := 'sedan',
  p_limit := 20
);
```

### Get Provider Statistics
```sql
SELECT * FROM get_provider_stats('provider-uuid-here');
```

### Refresh Materialized Views
```sql
-- Refresh all views
SELECT refresh_all_materialized_views();

-- Or individually
SELECT refresh_popular_cars();
SELECT refresh_provider_rankings();
```

## 📈 Performance Tips

### Indexes

All critical queries are indexed:
- Foreign keys
- Status columns
- Date ranges
- Search fields
- Location filters

### Materialized Views

Refresh periodically for best performance:
```sql
-- Manual refresh
SELECT refresh_all_materialized_views();

-- Or set up cron job (requires pg_cron extension)
SELECT cron.schedule(
  'refresh-views',
  '0 */6 * * *',  -- Every 6 hours
  'SELECT refresh_all_materialized_views()'
);
```

### Query Optimization

- Use prepared statements
- Leverage indexes
- Use materialized views for heavy queries
- Enable connection pooling

## 🧪 Testing

### Sample Data Generation

```sql
-- Generate test bookings
SELECT generate_sample_bookings(
  p_user_id := 'user-uuid',
  p_car_id := 1,
  p_provider_id := 'provider-uuid',
  p_count := 10
);
```

### Clean Test Data

```sql
-- WARNING: Deletes all test data
SELECT clean_test_data();
```

## 🔄 Maintenance

### Regular Tasks

1. **Backup Database**
   - Automatic daily backups via Supabase
   - Manual backups before major changes

2. **Monitor Performance**
   - Check slow queries in Supabase dashboard
   - Review index usage

3. **Update Statistics**
   ```sql
   ANALYZE;
   ```

4. **Refresh Views**
   ```sql
   SELECT refresh_all_materialized_views();
   ```

### Monitoring Queries

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## 🚨 Troubleshooting

### Common Issues

**Migration Fails:**
- Check if tables already exist
- Verify foreign key constraints
- Ensure extensions are enabled

**RLS Blocks Queries:**
- Verify user authentication
- Check policy conditions
- Use service role key for admin operations

**Slow Queries:**
- Check if indexes exist
- Refresh materialized views
- Review query execution plan with `EXPLAIN ANALYZE`

**Booking Validation Errors:**
- Verify date ranges
- Check car availability
- Ensure minimum/maximum rental periods

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Performance Tuning](https://supabase.com/docs/guides/database/performance)

## 🔗 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Optional, for admin ops
```

Get these from: Supabase Dashboard → Settings → API

## 📝 Migration Checklist

- [ ] Create Supabase project
- [ ] Run migration 001 (initial schema)
- [ ] Run migration 002 (RLS policies)
- [ ] Run migration 003 (functions & triggers)
- [ ] Run migration 004 (views & indexes)
- [ ] Add seed data (optional)
- [ ] Test authentication
- [ ] Verify RLS policies
- [ ] Test car search
- [ ] Test booking flow
- [ ] Configure environment variables
- [ ] Generate TypeScript types

## 🎯 Next Steps

1. Run all migrations in Supabase SQL Editor
2. Configure authentication settings
3. Generate TypeScript types
4. Test all functionality
5. Set up monitoring and alerts
6. Configure backup schedule
7. Review security policies
