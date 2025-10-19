-- =============================================================================
-- RENTALSCAR DATABASE SCHEMA - INITIAL SETUP
-- Migration: 20250118000001_initial_schema
-- Description: Creates all base tables, indexes, and initial data
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================================================
-- COUNTRIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE countries IS 'Stores country information for location filtering';
COMMENT ON COLUMN countries.code IS 'ISO 3166-1 alpha-3 country code';

-- Insert initial country data
INSERT INTO countries (name, code) VALUES
  ('United States', 'USA'),
  ('United Kingdom', 'GBR'),
  ('Canada', 'CAN'),
  ('Australia', 'AUS'),
  ('Germany', 'DEU'),
  ('France', 'FRA'),
  ('Spain', 'ESP'),
  ('Italy', 'ITA'),
  ('Mexico', 'MEX'),
  ('Brazil', 'BRA'),
  ('Argentina', 'ARG'),
  ('Japan', 'JPN'),
  ('China', 'CHN'),
  ('India', 'IND'),
  ('South Africa', 'ZAF')
ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- REGIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, country_id)
);

CREATE INDEX IF NOT EXISTS idx_regions_country ON regions(country_id);

COMMENT ON TABLE regions IS 'Stores regions/states within countries';

-- Insert sample regions for USA
INSERT INTO regions (name, country_id) 
SELECT name, country_id FROM (VALUES
  ('California', (SELECT id FROM countries WHERE code = 'USA')),
  ('New York', (SELECT id FROM countries WHERE code = 'USA')),
  ('Texas', (SELECT id FROM countries WHERE code = 'USA')),
  ('Florida', (SELECT id FROM countries WHERE code = 'USA')),
  ('Illinois', (SELECT id FROM countries WHERE code = 'USA')),
  ('Pennsylvania', (SELECT id FROM countries WHERE code = 'USA')),
  ('Ohio', (SELECT id FROM countries WHERE code = 'USA')),
  ('Georgia', (SELECT id FROM countries WHERE code = 'USA')),
  ('North Carolina', (SELECT id FROM countries WHERE code = 'USA')),
  ('Michigan', (SELECT id FROM countries WHERE code = 'USA')),
  ('Washington', (SELECT id FROM countries WHERE code = 'USA')),
  ('Arizona', (SELECT id FROM countries WHERE code = 'USA')),
  ('Massachusetts', (SELECT id FROM countries WHERE code = 'USA')),
  ('Tennessee', (SELECT id FROM countries WHERE code = 'USA')),
  ('Indiana', (SELECT id FROM countries WHERE code = 'USA'))
) AS t(name, country_id)
ON CONFLICT (name, country_id) DO NOTHING;

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  dateofbirth DATE,
  gender VARCHAR(20),
  avatar TEXT,
  city VARCHAR(100),
  street VARCHAR(255),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  country_id INTEGER REFERENCES countries(id),
  region_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country_id);
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region_id);

COMMENT ON TABLE users IS 'Stores customer information';
COMMENT ON COLUMN users.id IS 'References auth.users for authentication';

-- =============================================================================
-- PROVIDERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  companyname VARCHAR(255) NOT NULL,
  contactname VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  businessregistrationnumber VARCHAR(100),
  avatar TEXT,
  profileurl TEXT,
  city VARCHAR(100),
  street VARCHAR(255),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  country_id INTEGER REFERENCES countries(id),
  region_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);
CREATE INDEX IF NOT EXISTS idx_providers_country ON providers(country_id);
CREATE INDEX IF NOT EXISTS idx_providers_region ON providers(region_id);
CREATE INDEX IF NOT EXISTS idx_providers_created_at ON providers(created_at);

COMMENT ON TABLE providers IS 'Stores car rental provider/company information';
COMMENT ON COLUMN providers.businessregistrationnumber IS 'Legal business registration number';

-- =============================================================================
-- CARS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  type VARCHAR(50),
  transmission VARCHAR(50),
  enginecapacity VARCHAR(50),
  fueltype VARCHAR(50),
  description TEXT,
  seatingcapacity INTEGER CHECK (seatingcapacity > 0 AND seatingcapacity <= 20),
  numberofbags INTEGER CHECK (numberofbags >= 0),
  numberofdoors INTEGER CHECK (numberofdoors >= 2 AND numberofdoors <= 6),
  acavailable BOOLEAN DEFAULT false,
  acworking BOOLEAN DEFAULT false,
  images TEXT[],
  otherfeatures TEXT[],
  color VARCHAR(50),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'pending', 'booked', 'maintenance', 'inactive')),
  priceperday NUMERIC(10, 2) NOT NULL CHECK (priceperday > 0),
  minimumrentalperiodindays INTEGER DEFAULT 1 CHECK (minimumrentalperiodindays > 0),
  maximumrentalperiodindays INTEGER CHECK (maximumrentalperiodindays IS NULL OR maximumrentalperiodindays >= minimumrentalperiodindays),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  country_id INTEGER REFERENCES countries(id),
  region_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cars_provider ON cars(provider_id);
CREATE INDEX IF NOT EXISTS idx_cars_country ON cars(country_id);
CREATE INDEX IF NOT EXISTS idx_cars_region ON cars(region_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(priceperday);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_slug ON cars(slug);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_transmission ON cars(transmission);
CREATE INDEX IF NOT EXISTS idx_cars_fueltype ON cars(fueltype);

COMMENT ON TABLE cars IS 'Stores vehicle information';
COMMENT ON COLUMN cars.slug IS 'URL-friendly unique identifier for the car';
COMMENT ON COLUMN cars.status IS 'available, pending, booked, maintenance, inactive';

-- =============================================================================
-- BOOKINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  pickupdate DATE NOT NULL,
  returndate DATE NOT NULL CHECK (returndate > pickupdate),
  totalprice NUMERIC(10, 2) NOT NULL CHECK (totalprice >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(pickupdate, returndate);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

COMMENT ON TABLE bookings IS 'Stores rental bookings';
COMMENT ON COLUMN bookings.status IS 'pending, approved, rejected, completed, cancelled';

-- =============================================================================
-- REVIEWS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_car ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

COMMENT ON TABLE reviews IS 'Stores user reviews for cars and providers';
COMMENT ON COLUMN reviews.rating IS 'Rating from 1 to 5 stars';
