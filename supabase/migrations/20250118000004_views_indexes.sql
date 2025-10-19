-- =============================================================================
-- RENTALSCAR DATABASE - VIEWS AND ADDITIONAL INDEXES
-- Migration: 20250118000004_views_indexes
-- Description: Creates materialized views and performance indexes
-- =============================================================================

-- =============================================================================
-- MATERIALIZED VIEW: POPULAR CARS
-- =============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_cars AS
SELECT
  c.id,
  c.slug,
  c.make,
  c.model,
  c.year,
  c.type,
  c.priceperday,
  c.images,
  c.status,
  c.provider_id,
  p.companyname as provider_name,
  p.avatar as provider_avatar,
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT r.id) as total_reviews,
  COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating
FROM cars c
INNER JOIN providers p ON p.id = c.provider_id
LEFT JOIN bookings b ON b.car_id = c.id AND b.status IN ('completed', 'approved')
LEFT JOIN reviews r ON r.car_id = c.id
WHERE c.status = 'available'
GROUP BY c.id, p.companyname, p.avatar
ORDER BY total_bookings DESC, average_rating DESC
LIMIT 100;

CREATE UNIQUE INDEX IF NOT EXISTS idx_popular_cars_id ON popular_cars(id);
CREATE INDEX IF NOT EXISTS idx_popular_cars_rating ON popular_cars(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_popular_cars_bookings ON popular_cars(total_bookings DESC);

COMMENT ON MATERIALIZED VIEW popular_cars IS 'Cached view of most popular cars by bookings and ratings';

-- =============================================================================
-- MATERIALIZED VIEW: PROVIDER RANKINGS
-- =============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS provider_rankings AS
SELECT
  p.id,
  p.companyname,
  p.email,
  p.avatar,
  p.city,
  p.country_id,
  p.region_id,
  COUNT(DISTINCT c.id) as total_cars,
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_bookings,
  COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.totalprice ELSE 0 END), 0) as total_revenue,
  COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating,
  COUNT(DISTINCT r.id) as total_reviews
FROM providers p
LEFT JOIN cars c ON c.provider_id = p.id
LEFT JOIN bookings b ON b.provider_id = p.id
LEFT JOIN reviews r ON r.provider_id = p.id
GROUP BY p.id
ORDER BY average_rating DESC, total_bookings DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_provider_rankings_id ON provider_rankings(id);
CREATE INDEX IF NOT EXISTS idx_provider_rankings_rating ON provider_rankings(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_provider_rankings_revenue ON provider_rankings(total_revenue DESC);

COMMENT ON MATERIALIZED VIEW provider_rankings IS 'Cached view of provider performance metrics';

-- =============================================================================
-- VIEW: UPCOMING BOOKINGS
-- =============================================================================
CREATE OR REPLACE VIEW upcoming_bookings AS
SELECT
  b.id,
  b.user_id,
  b.car_id,
  b.provider_id,
  b.pickupdate,
  b.returndate,
  b.totalprice,
  b.status,
  b.notes,
  b.created_at,
  u.firstname as user_firstname,
  u.lastname as user_lastname,
  u.email as user_email,
  u.phone as user_phone,
  c.make as car_make,
  c.model as car_model,
  c.year as car_year,
  c.images as car_images,
  p.companyname as provider_name,
  p.phone as provider_phone
FROM bookings b
INNER JOIN users u ON u.id = b.user_id
INNER JOIN cars c ON c.id = b.car_id
INNER JOIN providers p ON p.id = b.provider_id
WHERE b.status IN ('pending', 'approved')
  AND b.pickupdate >= CURRENT_DATE
ORDER BY b.pickupdate ASC;

COMMENT ON VIEW upcoming_bookings IS 'All upcoming bookings with related user, car, and provider details';

-- =============================================================================
-- VIEW: BOOKING HISTORY
-- =============================================================================
CREATE OR REPLACE VIEW booking_history AS
SELECT
  b.id,
  b.user_id,
  b.car_id,
  b.provider_id,
  b.pickupdate,
  b.returndate,
  b.totalprice,
  b.status,
  b.created_at,
  (b.returndate - b.pickupdate) as rental_days,
  u.firstname as user_firstname,
  u.lastname as user_lastname,
  c.make as car_make,
  c.model as car_model,
  c.year as car_year,
  c.images as car_images,
  p.companyname as provider_name,
  r.rating as review_rating,
  r.comment as review_comment
FROM bookings b
INNER JOIN users u ON u.id = b.user_id
INNER JOIN cars c ON c.id = b.car_id
INNER JOIN providers p ON p.id = b.provider_id
LEFT JOIN reviews r ON r.car_id = b.car_id AND r.user_id = b.user_id
WHERE b.status IN ('completed', 'cancelled')
ORDER BY b.created_at DESC;

COMMENT ON VIEW booking_history IS 'Historical bookings with review information';

-- =============================================================================
-- VIEW: CAR AVAILABILITY CALENDAR
-- =============================================================================
CREATE OR REPLACE VIEW car_availability_calendar AS
SELECT
  c.id as car_id,
  c.make,
  c.model,
  c.status as car_status,
  b.id as booking_id,
  b.pickupdate,
  b.returndate,
  b.status as booking_status,
  b.user_id,
  u.firstname as user_firstname,
  u.lastname as user_lastname
FROM cars c
LEFT JOIN bookings b ON b.car_id = c.id 
  AND b.status IN ('pending', 'approved')
  AND b.returndate >= CURRENT_DATE
LEFT JOIN users u ON u.id = b.user_id
ORDER BY c.id, b.pickupdate;

COMMENT ON VIEW car_availability_calendar IS 'Shows car availability with current and future bookings';

-- =============================================================================
-- ADDITIONAL PERFORMANCE INDEXES
-- =============================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cars_location_status 
  ON cars(country_id, region_id, status) 
  WHERE status = 'available';

CREATE INDEX IF NOT EXISTS idx_cars_price_range 
  ON cars(priceperday, status) 
  WHERE status = 'available';

CREATE INDEX IF NOT EXISTS idx_bookings_user_status 
  ON bookings(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_provider_status 
  ON bookings(provider_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_date_range 
  ON bookings(pickupdate, returndate) 
  WHERE status IN ('pending', 'approved');

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cars_search 
  ON cars USING gin(to_tsvector('english', make || ' ' || model || ' ' || COALESCE(description, '')));

CREATE INDEX IF NOT EXISTS idx_providers_search 
  ON providers USING gin(to_tsvector('english', companyname || ' ' || COALESCE(contactname, '')));

-- =============================================================================
-- REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- =============================================================================

CREATE OR REPLACE FUNCTION refresh_popular_cars()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_cars;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_provider_rankings()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY provider_rankings;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  PERFORM refresh_popular_cars();
  PERFORM refresh_provider_rankings();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_popular_cars IS 'Refreshes the popular_cars materialized view';
COMMENT ON FUNCTION refresh_provider_rankings IS 'Refreshes the provider_rankings materialized view';
COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refreshes all materialized views';

-- =============================================================================
-- SCHEDULED REFRESH (Run this manually or via cron)
-- =============================================================================
-- To set up automatic refresh, use pg_cron extension:
-- SELECT cron.schedule('refresh-views', '0 */6 * * *', 'SELECT refresh_all_materialized_views()');
