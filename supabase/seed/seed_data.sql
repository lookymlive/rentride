-- =============================================================================
-- RENTALSCAR DATABASE - SEED DATA
-- Description: Sample data for development and testing
-- =============================================================================

-- =============================================================================
-- ADDITIONAL REGIONS FOR TESTING
-- =============================================================================

-- UK Regions
INSERT INTO regions (name, country_id) 
SELECT name, country_id FROM (VALUES
  ('England', (SELECT id FROM countries WHERE code = 'GBR')),
  ('Scotland', (SELECT id FROM countries WHERE code = 'GBR')),
  ('Wales', (SELECT id FROM countries WHERE code = 'GBR')),
  ('Northern Ireland', (SELECT id FROM countries WHERE code = 'GBR'))
) AS t(name, country_id)
ON CONFLICT (name, country_id) DO NOTHING;

-- Canada Regions
INSERT INTO regions (name, country_id) 
SELECT name, country_id FROM (VALUES
  ('Ontario', (SELECT id FROM countries WHERE code = 'CAN')),
  ('Quebec', (SELECT id FROM countries WHERE code = 'CAN')),
  ('British Columbia', (SELECT id FROM countries WHERE code = 'CAN')),
  ('Alberta', (SELECT id FROM countries WHERE code = 'CAN'))
) AS t(name, country_id)
ON CONFLICT (name, country_id) DO NOTHING;

-- Australia Regions
INSERT INTO regions (name, country_id) 
SELECT name, country_id FROM (VALUES
  ('New South Wales', (SELECT id FROM countries WHERE code = 'AUS')),
  ('Victoria', (SELECT id FROM countries WHERE code = 'AUS')),
  ('Queensland', (SELECT id FROM countries WHERE code = 'AUS')),
  ('Western Australia', (SELECT id FROM countries WHERE code = 'AUS'))
) AS t(name, country_id)
ON CONFLICT (name, country_id) DO NOTHING;

-- =============================================================================
-- SAMPLE USERS (For Testing Only - Remove in Production)
-- =============================================================================
-- Note: These require actual auth.users entries to be created first
-- This is just a template showing the structure

/*
-- Example user insert (after creating auth user)
INSERT INTO users (
  id, 
  firstname, 
  lastname, 
  email, 
  phone, 
  dateofbirth, 
  gender, 
  city, 
  country_id, 
  region_id
) VALUES (
  'user-uuid-here',
  'John',
  'Doe',
  'john.doe@example.com',
  '+1-555-0100',
  '1990-01-15',
  'male',
  'Los Angeles',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California')
) ON CONFLICT (id) DO NOTHING;
*/

-- =============================================================================
-- SAMPLE PROVIDERS (For Testing Only - Remove in Production)
-- =============================================================================

/*
-- Example provider insert (after creating auth user)
INSERT INTO providers (
  id,
  companyname,
  contactname,
  email,
  phone,
  businessregistrationnumber,
  city,
  street,
  latitude,
  longitude,
  country_id,
  region_id
) VALUES (
  'provider-uuid-here',
  'Premium Car Rentals',
  'Jane Smith',
  'contact@premiumcars.com',
  '+1-555-0200',
  'BRN-12345',
  'Los Angeles',
  '123 Main Street',
  34.0522,
  -118.2437,
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California')
) ON CONFLICT (id) DO NOTHING;
*/

-- =============================================================================
-- SAMPLE CARS (For Testing Only - Remove in Production)
-- =============================================================================

/*
-- Example car insert (requires provider_id from above)
INSERT INTO cars (
  make,
  model,
  year,
  type,
  transmission,
  enginecapacity,
  fueltype,
  description,
  seatingcapacity,
  numberofbags,
  numberofdoors,
  acavailable,
  acworking,
  color,
  status,
  priceperday,
  minimumrentalperiodindays,
  maximumrentalperiodindays,
  provider_id,
  country_id,
  region_id,
  images,
  otherfeatures
) VALUES 
(
  'Toyota',
  'Camry',
  2023,
  'sedan',
  'automatic',
  '2.5L',
  'petrol',
  'Comfortable and reliable sedan perfect for city driving and long trips.',
  5,
  3,
  4,
  true,
  true,
  'Silver',
  'available',
  45.00,
  1,
  30,
  'provider-uuid-here',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California'),
  ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  ARRAY['Bluetooth', 'Backup Camera', 'Cruise Control']
),
(
  'Honda',
  'CR-V',
  2023,
  'suv',
  'automatic',
  '1.5L Turbo',
  'petrol',
  'Spacious SUV with excellent fuel economy and modern features.',
  7,
  4,
  4,
  true,
  true,
  'Black',
  'available',
  65.00,
  1,
  30,
  'provider-uuid-here',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California'),
  ARRAY['https://example.com/image3.jpg', 'https://example.com/image4.jpg'],
  ARRAY['Apple CarPlay', 'Android Auto', 'Lane Assist', 'Sunroof']
),
(
  'Tesla',
  'Model 3',
  2024,
  'sedan',
  'automatic',
  'Electric',
  'electric',
  'Premium electric sedan with autopilot and long range.',
  5,
  2,
  4,
  true,
  true,
  'White',
  'available',
  95.00,
  2,
  14,
  'provider-uuid-here',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California'),
  ARRAY['https://example.com/image5.jpg', 'https://example.com/image6.jpg'],
  ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'Supercharging']
);
*/

-- =============================================================================
-- UTILITY: CLEAN TEST DATA
-- =============================================================================

-- Function to clean all test data (use with caution!)
CREATE OR REPLACE FUNCTION clean_test_data()
RETURNS void AS $$
BEGIN
  -- Delete in correct order to respect foreign keys
  DELETE FROM reviews;
  DELETE FROM bookings;
  DELETE FROM cars;
  DELETE FROM providers;
  DELETE FROM users WHERE email LIKE '%@example.com';
  
  RAISE NOTICE 'Test data cleaned successfully';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION clean_test_data IS 'Removes all test data - USE WITH CAUTION';

-- =============================================================================
-- UTILITY: GENERATE SAMPLE BOOKINGS
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_sample_bookings(
  p_user_id UUID,
  p_car_id INTEGER,
  p_provider_id UUID,
  p_count INTEGER DEFAULT 5
)
RETURNS void AS $$
DECLARE
  i INTEGER;
  random_days INTEGER;
  start_date DATE;
  end_date DATE;
  price NUMERIC;
BEGIN
  FOR i IN 1..p_count LOOP
    -- Generate random dates in the past
    random_days := floor(random() * 365)::INTEGER;
    start_date := CURRENT_DATE - random_days;
    end_date := start_date + floor(random() * 14 + 1)::INTEGER;
    
    -- Get car price
    SELECT priceperday INTO price FROM cars WHERE id = p_car_id;
    
    INSERT INTO bookings (
      user_id,
      car_id,
      provider_id,
      pickupdate,
      returndate,
      totalprice,
      status
    ) VALUES (
      p_user_id,
      p_car_id,
      p_provider_id,
      start_date,
      end_date,
      price * (end_date - start_date),
      CASE 
        WHEN random() < 0.7 THEN 'completed'
        WHEN random() < 0.9 THEN 'approved'
        ELSE 'cancelled'
      END
    );
  END LOOP;
  
  RAISE NOTICE 'Generated % sample bookings', p_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_sample_bookings IS 'Generates random sample bookings for testing';
