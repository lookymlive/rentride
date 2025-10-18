# 🗄️ Database Schema

## Overview

Car Go Rentals uses **Supabase (PostgreSQL)** as its database. This document outlines the complete database schema, relationships, and setup instructions.

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   users     │         │  providers  │         │  countries  │
│─────────────│         │─────────────│         │─────────────│
│ id (PK)     │         │ id (PK)     │    ┌────│ id (PK)     │
│ firstName   │         │ companyName │    │    │ name        │
│ lastName    │         │ email       │    │    │ code        │
│ email       │         │ phone       │    │    └─────────────┘
│ avatar      │         │ country_id  │────┘           │
│ phone       │         │ region_id   │────┐           │
│ ...         │         │ ...         │    │           │
└─────────────┘         └─────────────┘    │    ┌─────────────┐
       │                       │            └────│   regions   │
       │                       │                 │─────────────│
       │                       │                 │ id (PK)     │
       │                       │                 │ name        │
       │                       │                 │ country_id  │
       │                       │                 └─────────────┘
       │                       │
       │                       │
       │                ┌─────────────┐
       │                │    cars     │
       │                │─────────────│
       │                │ id (PK)     │
       │                │ make        │
       │                │ model       │
       │                │ year        │
       │                │ provider_id │───┐
       │                │ country_id  │   │
       │                │ region_id   │   │
       │                │ status      │   │
       │                │ ...         │   │
       │                └─────────────┘   │
       │                       │          │
       │                       │          │
       │                ┌─────────────┐   │
       └────────────────│  bookings   │   │
                        │─────────────│   │
                        │ id (PK)     │   │
                        │ user_id     │───┘
                        │ car_id      │───┘
                        │ provider_id │───┘
                        │ pickupDate  │
                        │ returnDate  │
                        │ totalPrice  │
                        │ status      │
                        └─────────────┘
```

---

## 📋 Tables

### 1. `users`

Stores customer information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  dateOfBirth DATE,
  gender VARCHAR(20),
  avatar TEXT,
  city VARCHAR(100),
  street VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Fields:**
- `id`: UUID from Supabase Auth
- `firstName`, `lastName`: User's name
- `email`: Unique email address
- `phone`: Contact number
- `dateOfBirth`: User's birth date
- `gender`: User's gender
- `avatar`: Profile picture URL (Cloudinary)
- `city`, `street`: Address information
- `latitude`, `longitude`: Geolocation coordinates

---

### 2. `providers`

Stores car rental provider/company information.

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  companyName VARCHAR(255) NOT NULL,
  contactName VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  businessRegistrationNumber VARCHAR(100),
  avatar TEXT,
  profileUrl TEXT,
  city VARCHAR(100),
  street VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country_id INTEGER REFERENCES countries(id),
  region_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_providers_email ON providers(email);
CREATE INDEX idx_providers_country ON providers(country_id);
CREATE INDEX idx_providers_region ON providers(region_id);
```

**Fields:**
- `id`: UUID from Supabase Auth
- `companyName`: Business name
- `contactName`: Primary contact person
- `email`: Business email
- `phone`: Business phone
- `businessRegistrationNumber`: Legal registration number
- `avatar`: Company logo URL
- `profileUrl`: Company website
- `country_id`, `region_id`: Location references

---

### 3. `countries`

Stores country information for location filtering.

```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample data
INSERT INTO countries (name, code) VALUES
  ('United States', 'USA'),
  ('United Kingdom', 'GBR'),
  ('Canada', 'CAN'),
  ('Australia', 'AUS'),
  ('Germany', 'DEU'),
  ('France', 'FRA'),
  ('Spain', 'ESP'),
  ('Italy', 'ITA');
```

---

### 4. `regions`

Stores regions/states within countries.

```sql
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, country_id)
);

-- Indexes
CREATE INDEX idx_regions_country ON regions(country_id);

-- Sample data for USA
INSERT INTO regions (name, country_id) VALUES
  ('California', 1),
  ('New York', 1),
  ('Texas', 1),
  ('Florida', 1);
```

---

### 5. `cars`

Stores vehicle information.

```sql
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(50),
  transmission VARCHAR(50),
  engineCapacity VARCHAR(50),
  fuelType VARCHAR(50),
  description TEXT,
  seatingCapacity INTEGER,
  numberOfBags INTEGER,
  numberOfDoors INTEGER,
  acAvailable BOOLEAN DEFAULT false,
  acWorking BOOLEAN DEFAULT false,
  images TEXT[], -- Array of image URLs
  otherFeatures TEXT[],
  color VARCHAR(50),
  status VARCHAR(20) DEFAULT 'available', -- available, pending, booked
  pricePerDay DECIMAL(10, 2) NOT NULL,
  minimumRentalPeriodInDays INTEGER DEFAULT 1,
  maximumRentalPeriodInDays INTEGER,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  country_id INTEGER REFERENCES countries(id),
  region_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cars_provider ON cars(provider_id);
CREATE INDEX idx_cars_country ON cars(country_id);
CREATE INDEX idx_cars_region ON cars(region_id);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_price ON cars(pricePerDay);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_type ON cars(type);
```

**Fields:**
- `make`, `model`, `year`: Vehicle identification
- `type`: sedan, suv, convertible, etc.
- `transmission`: automatic, manual
- `fuelType`: petrol, diesel, electric, hybrid
- `images`: Array of Cloudinary URLs
- `status`: available, pending, booked
- `pricePerDay`: Daily rental rate

---

### 6. `bookings`

Stores rental bookings.

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  pickupDate DATE NOT NULL,
  returnDate DATE NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_car ON bookings(car_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(pickupDate, returnDate);
```

**Status Flow:**
1. `pending` - Initial booking request
2. `approved` - Provider accepted
3. `rejected` - Provider declined
4. `completed` - Rental finished
5. `cancelled` - Cancelled by user or provider

---

## 🔐 Row Level Security (RLS)

Enable RLS on all tables for security:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Providers policies
CREATE POLICY "Providers can view own profile" ON providers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Providers can update own profile" ON providers
  FOR UPDATE USING (auth.uid() = id);

-- Cars policies
CREATE POLICY "Anyone can view available cars" ON cars
  FOR SELECT USING (status = 'available');

CREATE POLICY "Providers can manage own cars" ON cars
  FOR ALL USING (auth.uid() = provider_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Providers can view bookings for their cars" ON bookings
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can update booking status" ON bookings
  FOR UPDATE USING (auth.uid() = provider_id);
```

---

## 🔄 Database Functions

### Check Car Availability

```sql
CREATE OR REPLACE FUNCTION check_car_availability(
  p_car_id INTEGER,
  p_pickup_date DATE,
  p_return_date DATE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE car_id = p_car_id
      AND status IN ('pending', 'approved')
      AND (
        (pickupDate <= p_pickup_date AND returnDate >= p_pickup_date)
        OR (pickupDate <= p_return_date AND returnDate >= p_return_date)
        OR (pickupDate >= p_pickup_date AND returnDate <= p_return_date)
      )
  );
END;
$$ LANGUAGE plpgsql;
```

### Update Car Status Trigger

```sql
CREATE OR REPLACE FUNCTION update_car_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE cars SET status = 'booked' WHERE id = NEW.car_id;
  ELSIF OLD.status = 'approved' AND NEW.status IN ('completed', 'cancelled') THEN
    UPDATE cars SET status = 'available' WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_status_change
  AFTER INSERT OR UPDATE OF status ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_car_status();
```

---

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Wait for setup to complete

### 2. Run Migrations

Copy and run each SQL block in the Supabase SQL Editor:

1. Create tables (users, providers, countries, regions, cars, bookings)
2. Create indexes
3. Enable RLS and create policies
4. Create functions and triggers
5. Insert sample data for countries and regions

### 3. Configure Authentication

1. Go to Authentication → Settings
2. Enable Email provider
3. Configure email templates
4. Set site URL to your app URL

### 4. Get API Keys

1. Go to Settings → API
2. Copy `Project URL` and `anon public` key
3. Add to your `.env.local` file

---

## 📝 Sample Queries

### Get Available Cars in a Region

```sql
SELECT c.*, p.companyName, p.avatar as providerAvatar
FROM cars c
JOIN providers p ON c.provider_id = p.id
WHERE c.country_id = 1
  AND c.region_id = 2
  AND c.status = 'available'
  AND c.pricePerDay BETWEEN 50 AND 200
ORDER BY c.pricePerDay ASC;
```

### Get User Bookings with Car Details

```sql
SELECT 
  b.*,
  c.make, c.model, c.year, c.images,
  p.companyName
FROM bookings b
JOIN cars c ON b.car_id = c.id
JOIN providers p ON b.provider_id = p.id
WHERE b.user_id = 'user-uuid-here'
ORDER BY b.created_at DESC;
```

---

## 🔧 Maintenance

### Regular Tasks

1. **Backup Database**: Use Supabase automatic backups
2. **Monitor Performance**: Check slow queries in Supabase dashboard
3. **Update Statistics**: Run `ANALYZE` periodically
4. **Archive Old Bookings**: Move completed bookings older than 1 year to archive table

### Optimization Tips

- Add indexes on frequently queried columns
- Use materialized views for complex reports
- Implement database connection pooling
- Monitor and optimize slow queries

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
