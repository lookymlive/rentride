-- =============================================================================
-- RENTALSCAR DATABASE - FUNCTIONS AND TRIGGERS
-- Migration: 20250118000003_functions_triggers
-- Description: Business logic functions and automated triggers
-- =============================================================================

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column IS 'Automatically updates the updated_at timestamp';

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
CREATE TRIGGER update_providers_updated_at 
  BEFORE UPDATE ON providers
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at 
  BEFORE UPDATE ON cars
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- CAR AVAILABILITY CHECKER
-- =============================================================================
CREATE OR REPLACE FUNCTION check_car_availability(
  p_car_id INTEGER,
  p_pickup_date DATE,
  p_return_date DATE,
  p_exclude_booking_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  -- Check if car exists and is available
  IF NOT EXISTS (
    SELECT 1 FROM cars 
    WHERE id = p_car_id 
    AND status IN ('available', 'pending')
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check for overlapping bookings
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE car_id = p_car_id
      AND status IN ('pending', 'approved')
      AND (id IS NULL OR id != COALESCE(p_exclude_booking_id, -1))
      AND (
        -- New booking starts during existing booking
        (pickupdate <= p_pickup_date AND returndate >= p_pickup_date)
        -- New booking ends during existing booking
        OR (pickupdate <= p_return_date AND returndate >= p_return_date)
        -- New booking completely contains existing booking
        OR (pickupdate >= p_pickup_date AND returndate <= p_return_date)
      )
  ) INTO is_available;

  RETURN is_available;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_car_availability IS 'Checks if a car is available for the specified date range';

-- =============================================================================
-- CAR STATUS MANAGEMENT TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION update_car_status_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- When booking is approved, mark car as booked
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    UPDATE cars 
    SET status = 'booked' 
    WHERE id = NEW.car_id;
    
  -- When booking is completed or cancelled, check if car should be available
  ELSIF (OLD.status = 'approved' OR OLD.status = 'pending') 
        AND NEW.status IN ('completed', 'cancelled', 'rejected') THEN
    
    -- Only set to available if no other active bookings exist
    IF NOT EXISTS (
      SELECT 1 FROM bookings
      WHERE car_id = NEW.car_id
        AND id != NEW.id
        AND status IN ('pending', 'approved')
    ) THEN
      UPDATE cars 
      SET status = 'available' 
      WHERE id = NEW.car_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_status_change ON bookings;
CREATE TRIGGER booking_status_change
  AFTER INSERT OR UPDATE OF status ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_car_status_on_booking();

COMMENT ON FUNCTION update_car_status_on_booking IS 'Automatically updates car status based on booking changes';

-- =============================================================================
-- BOOKING VALIDATION TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION validate_booking()
RETURNS TRIGGER AS $$
DECLARE
  car_min_days INTEGER;
  car_max_days INTEGER;
  rental_days INTEGER;
BEGIN
  -- Calculate rental period
  rental_days := NEW.returndate - NEW.pickupdate;

  -- Get car rental period constraints
  SELECT minimumrentalperiodindays, maximumrentalperiodindays
  INTO car_min_days, car_max_days
  FROM cars
  WHERE id = NEW.car_id;

  -- Validate minimum rental period
  IF rental_days < car_min_days THEN
    RAISE EXCEPTION 'Rental period must be at least % days', car_min_days;
  END IF;

  -- Validate maximum rental period
  IF car_max_days IS NOT NULL AND rental_days > car_max_days THEN
    RAISE EXCEPTION 'Rental period cannot exceed % days', car_max_days;
  END IF;

  -- Check car availability
  IF NOT check_car_availability(NEW.car_id, NEW.pickupdate, NEW.returndate, NEW.id) THEN
    RAISE EXCEPTION 'Car is not available for the selected dates';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_booking_trigger ON bookings;
CREATE TRIGGER validate_booking_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking();

COMMENT ON FUNCTION validate_booking IS 'Validates booking constraints before insert/update';

-- =============================================================================
-- AUTO-GENERATE CAR SLUG
-- =============================================================================
CREATE OR REPLACE FUNCTION generate_car_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from make, model, and year
  base_slug := lower(
    regexp_replace(
      NEW.make || '-' || NEW.model || '-' || NEW.year::TEXT,
      '[^a-z0-9]+', '-', 'gi'
    )
  );
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM cars WHERE slug = final_slug AND id != COALESCE(NEW.id, -1)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_car_slug_trigger ON cars;
CREATE TRIGGER generate_car_slug_trigger
  BEFORE INSERT OR UPDATE OF make, model, year ON cars
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_car_slug();

COMMENT ON FUNCTION generate_car_slug IS 'Automatically generates a unique slug for cars';

-- =============================================================================
-- CALCULATE BOOKING STATISTICS
-- =============================================================================
CREATE OR REPLACE FUNCTION get_provider_stats(provider_uuid UUID)
RETURNS TABLE (
  total_cars INTEGER,
  active_cars INTEGER,
  total_bookings BIGINT,
  pending_bookings BIGINT,
  approved_bookings BIGINT,
  completed_bookings BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT c.id)::INTEGER as total_cars,
    COUNT(DISTINCT CASE WHEN c.status = 'available' THEN c.id END)::INTEGER as active_cars,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN b.status = 'approved' THEN 1 END) as approved_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.totalprice ELSE 0 END), 0) as total_revenue
  FROM providers p
  LEFT JOIN cars c ON c.provider_id = p.id
  LEFT JOIN bookings b ON b.provider_id = p.id
  WHERE p.id = provider_uuid
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_provider_stats IS 'Returns comprehensive statistics for a provider';

-- =============================================================================
-- GET CAR WITH AVERAGE RATING
-- =============================================================================
CREATE OR REPLACE FUNCTION get_car_with_rating(car_id_param INTEGER)
RETURNS TABLE (
  id INTEGER,
  make VARCHAR,
  model VARCHAR,
  year INTEGER,
  priceperday NUMERIC,
  status VARCHAR,
  images TEXT[],
  average_rating NUMERIC,
  total_reviews BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.make,
    c.model,
    c.year,
    c.priceperday,
    c.status,
    c.images,
    COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating,
    COUNT(r.id) as total_reviews
  FROM cars c
  LEFT JOIN reviews r ON r.car_id = c.id
  WHERE c.id = car_id_param
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_car_with_rating IS 'Returns car details with average rating and review count';

-- =============================================================================
-- SEARCH CARS WITH FILTERS
-- =============================================================================
CREATE OR REPLACE FUNCTION search_cars(
  p_country_id INTEGER DEFAULT NULL,
  p_region_id INTEGER DEFAULT NULL,
  p_pickup_date DATE DEFAULT NULL,
  p_return_date DATE DEFAULT NULL,
  p_min_price NUMERIC DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL,
  p_car_type VARCHAR DEFAULT NULL,
  p_transmission VARCHAR DEFAULT NULL,
  p_fuel_type VARCHAR DEFAULT NULL,
  p_min_year INTEGER DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
  slug VARCHAR,
  make VARCHAR,
  model VARCHAR,
  year INTEGER,
  type VARCHAR,
  transmission VARCHAR,
  fueltype VARCHAR,
  priceperday NUMERIC,
  images TEXT[],
  provider_id UUID,
  provider_name VARCHAR,
  average_rating NUMERIC,
  total_reviews BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.slug,
    c.make,
    c.model,
    c.year,
    c.type,
    c.transmission,
    c.fueltype,
    c.priceperday,
    c.images,
    c.provider_id,
    p.companyname as provider_name,
    COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating,
    COUNT(r.id) as total_reviews
  FROM cars c
  INNER JOIN providers p ON p.id = c.provider_id
  LEFT JOIN reviews r ON r.car_id = c.id
  WHERE
    c.status = 'available'
    AND (p_country_id IS NULL OR c.country_id = p_country_id)
    AND (p_region_id IS NULL OR c.region_id = p_region_id)
    AND (p_min_price IS NULL OR c.priceperday >= p_min_price)
    AND (p_max_price IS NULL OR c.priceperday <= p_max_price)
    AND (p_car_type IS NULL OR c.type = p_car_type)
    AND (p_transmission IS NULL OR c.transmission = p_transmission)
    AND (p_fuel_type IS NULL OR c.fueltype = p_fuel_type)
    AND (p_min_year IS NULL OR c.year >= p_min_year)
    AND (
      p_pickup_date IS NULL 
      OR p_return_date IS NULL 
      OR check_car_availability(c.id, p_pickup_date, p_return_date)
    )
  GROUP BY c.id, p.companyname
  ORDER BY c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_cars IS 'Advanced car search with multiple filters and availability checking';
