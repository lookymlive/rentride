-- =============================================================================
-- RENTALSCAR DATABASE - ROW LEVEL SECURITY POLICIES
-- Migration: 20250118000002_rls_policies
-- Description: Implements comprehensive RLS policies for all tables
-- =============================================================================

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Countries and regions are public read-only
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- COUNTRIES POLICIES (Public Read)
-- =============================================================================
CREATE POLICY "Countries are viewable by everyone"
  ON countries FOR SELECT
  USING (true);

-- =============================================================================
-- REGIONS POLICIES (Public Read)
-- =============================================================================
CREATE POLICY "Regions are viewable by everyone"
  ON regions FOR SELECT
  USING (true);

-- =============================================================================
-- USERS POLICIES
-- =============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON users FOR DELETE
  USING (auth.uid() = id);

-- Providers can view user profiles for their bookings
CREATE POLICY "Providers can view users who booked their cars"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.user_id = users.id
      AND b.provider_id = auth.uid()
    )
  );

-- =============================================================================
-- PROVIDERS POLICIES
-- =============================================================================

-- Providers can view their own profile
CREATE POLICY "Providers can view own profile"
  ON providers FOR SELECT
  USING (auth.uid() = id);

-- Providers can insert their own profile
CREATE POLICY "Providers can insert own profile"
  ON providers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Providers can update their own profile
CREATE POLICY "Providers can update own profile"
  ON providers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Providers can delete their own profile
CREATE POLICY "Providers can delete own profile"
  ON providers FOR DELETE
  USING (auth.uid() = id);

-- Anyone can view provider profiles (public information)
CREATE POLICY "Provider profiles are publicly viewable"
  ON providers FOR SELECT
  USING (true);

-- =============================================================================
-- CARS POLICIES
-- =============================================================================

-- Anyone can view available cars
CREATE POLICY "Anyone can view available cars"
  ON cars FOR SELECT
  USING (status IN ('available', 'pending', 'booked'));

-- Providers can view all their own cars
CREATE POLICY "Providers can view all own cars"
  ON cars FOR SELECT
  USING (auth.uid() = provider_id);

-- Providers can insert their own cars
CREATE POLICY "Providers can insert own cars"
  ON cars FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Providers can update their own cars
CREATE POLICY "Providers can update own cars"
  ON cars FOR UPDATE
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

-- Providers can delete their own cars
CREATE POLICY "Providers can delete own cars"
  ON cars FOR DELETE
  USING (auth.uid() = provider_id);

-- Users can view cars they have booked
CREATE POLICY "Users can view cars they booked"
  ON cars FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.car_id = cars.id
      AND b.user_id = auth.uid()
    )
  );

-- =============================================================================
-- BOOKINGS POLICIES
-- =============================================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookings for themselves
CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings (cancel)
CREATE POLICY "Users can update own pending bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Providers can view bookings for their cars
CREATE POLICY "Providers can view bookings for their cars"
  ON bookings FOR SELECT
  USING (auth.uid() = provider_id);

-- Providers can update booking status for their cars
CREATE POLICY "Providers can update booking status"
  ON bookings FOR UPDATE
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

-- =============================================================================
-- REVIEWS POLICIES
-- =============================================================================

-- Anyone can view reviews
CREATE POLICY "Reviews are publicly viewable"
  ON reviews FOR SELECT
  USING (true);

-- Users can create reviews for cars they have booked
CREATE POLICY "Users can create reviews for booked cars"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.car_id = reviews.car_id
      AND b.user_id = auth.uid()
      AND b.status = 'completed'
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================================================

-- Function to check if user is a provider
CREATE OR REPLACE FUNCTION is_provider(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM providers WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a customer
CREATE OR REPLACE FUNCTION is_customer(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_provider IS 'Checks if a user UUID belongs to a provider';
COMMENT ON FUNCTION is_customer IS 'Checks if a user UUID belongs to a customer';
