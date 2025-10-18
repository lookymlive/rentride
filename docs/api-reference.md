# 🔌 API Reference

## Overview

RentRide uses **Next.js Server Actions** and **API Routes** for backend functionality. This document provides a complete reference for all available endpoints and actions.

---

## 📋 Table of Contents

- [Server Actions](#server-actions)
  - [Cars Actions](#cars-actions)
  - [Users Actions](#users-actions)
  - [Providers Actions](#providers-actions)
  - [Session Actions](#session-actions)
- [API Routes](#api-routes)
- [Error Handling](#error-handling)
- [Type Definitions](#type-definitions)

---

## 🎬 Server Actions

Server Actions are located in `src/actions/` and provide type-safe server-side operations.

### Cars Actions

**File**: `src/actions/cars.actions.ts`

#### `getCarsAsync(filters)`

Get filtered list of cars.

```typescript
async function getCarsAsync(filters?: {
  country_id?: number;
  region_id?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  fuelType?: string;
}): Promise<IResCarProps[]>
```

**Parameters:**
- `filters` (optional): Object with filter criteria

**Returns:** Array of car objects

**Example:**
```typescript
const cars = await getCarsAsync({
  country_id: 1,
  region_id: 2,
  minPrice: 50,
  maxPrice: 200,
  type: 'sedan'
});
```

---

#### `getCarByIdAsync(carId)`

Get detailed information for a specific car.

```typescript
async function getCarByIdAsync(carId: number): Promise<IResCarProps>
```

**Parameters:**
- `carId`: Car ID

**Returns:** Car object with full details

**Example:**
```typescript
const car = await getCarByIdAsync(123);
```

---

#### `addCarAsync(carData)`

Add a new car (Provider only).

```typescript
async function addCarAsync(carData: IReqCarProps): Promise<PostgrestSingleResponse<any>>
```

**Parameters:**
- `carData`: Car information object

**Returns:** Created car object

**Example:**
```typescript
const newCar = await addCarAsync({
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  pricePerDay: 75,
  provider_id: 'uuid-here',
  // ... other fields
});
```

---

#### `updateCarAsync(carId, updates)`

Update car information (Provider only).

```typescript
async function updateCarAsync(
  carId: number,
  updates: Partial<IReqCarProps>
): Promise<PostgrestSingleResponse<any>>
```

**Parameters:**
- `carId`: Car ID to update
- `updates`: Object with fields to update

**Returns:** Updated car object

---

#### `deleteCarAsync(carId)`

Delete a car (Provider only).

```typescript
async function deleteCarAsync(carId: number): Promise<void>
```

**Parameters:**
- `carId`: Car ID to delete

---

#### `getProviderCarsAsync(providerId)`

Get all cars for a specific provider.

```typescript
async function getProviderCarsAsync(providerId: string): Promise<IResCarProps[]>
```

---

### Users Actions

**File**: `src/actions/users.actions.ts`

#### `getUserProfileAsync(userId)`

Get user profile information.

```typescript
async function getUserProfileAsync(userId: string): Promise<IBaseUserProps>
```

---

#### `updateUserProfileAsync(userId, updates)`

Update user profile.

```typescript
async function updateUserProfileAsync(
  userId: string,
  updates: Partial<IBaseUserProps>
): Promise<PostgrestSingleResponse<any>>
```

---

#### `createUserAsync(userData)`

Create new user profile (called after signup).

```typescript
async function createUserAsync(userData: IReqUserProps): Promise<PostgrestSingleResponse<any>>
```

---

#### `getUserBookingsAsync(userId)`

Get all bookings for a user.

```typescript
async function getUserBookingsAsync(userId: string): Promise<IBaseBookingProps[]>
```

---

### Providers Actions

**File**: `src/actions/providers.actions.ts`

#### `getProviderProfileAsync(providerId)`

Get provider profile information.

```typescript
async function getProviderProfileAsync(providerId: string): Promise<IBaseProviderProps>
```

---

#### `updateProviderProfileAsync(providerId, updates)`

Update provider profile.

```typescript
async function updateProviderProfileAsync(
  providerId: string,
  updates: Partial<IBaseProviderProps>
): Promise<PostgrestSingleResponse<any>>
```

---

#### `createProviderAsync(providerData)`

Create new provider profile.

```typescript
async function createProviderAsync(
  providerData: IReqProviderProps
): Promise<PostgrestSingleResponse<any>>
```

---

#### `getProviderBookingsAsync(providerId)`

Get all bookings for a provider's cars.

```typescript
async function getProviderBookingsAsync(providerId: string): Promise<IBaseBookingProps[]>
```

---

#### `updateBookingStatusAsync(bookingId, status)`

Update booking status (approve/reject).

```typescript
async function updateBookingStatusAsync(
  bookingId: number,
  status: 'approved' | 'rejected'
): Promise<PostgrestSingleResponse<any>>
```

---

### Session Actions

**File**: `src/actions/session.actions.ts`

#### `getSession()`

Get current user session.

```typescript
async function getSession(): Promise<Session | null>
```

**Returns:** Session object or null

---

#### `isAuthenticated()`

Check if user is authenticated.

```typescript
async function isAuthenticated(): Promise<boolean>
```

---

#### `isProviderSession()`

Check if current session is a provider.

```typescript
async function isProviderSession(): Promise<boolean>
```

**Usage:** Protect provider-only routes

---

#### `requireAuth()`

Require authentication (throws if not authenticated).

```typescript
async function requireAuth(): Promise<Session>
```

**Throws:** Redirects to login if not authenticated

---

## 🛣️ API Routes

API Routes are located in `src/app/api/`.

### Authentication Callback

**Endpoint**: `GET /api/auth/callback`

**File**: `src/app/auth/callback/route.ts`

Handles OAuth callbacks and email verification.

**Query Parameters:**
- `code`: Authorization code from Supabase

**Response:** Redirects to appropriate page

---

### Image Upload

**Endpoint**: `POST /api/upload`

Upload images to Cloudinary.

**Request Body:**
```json
{
  "file": "base64-encoded-image",
  "folder": "cars" // or "avatars"
}
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "image-id"
}
```

---

## ⚠️ Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

### Error Handling Example

```typescript
try {
  const car = await getCarByIdAsync(123);
} catch (error) {
  if (error.code === 'PGRST116') {
    // Not found
    console.error('Car not found');
  } else {
    // Other error
    console.error('Error fetching car:', error);
  }
}
```

---

## 📝 Type Definitions

### Request Types

```typescript
// Car request
interface IReqCarProps {
  make: string;
  model: string;
  year: number;
  transmission: string;
  engineCapacity: string;
  fuelType: string;
  description: string;
  seatingCapacity: number;
  numberOfBags: number;
  numberOfDoors: number;
  acAvailable: boolean;
  acWorking: boolean;
  images: string[];
  otherFeatures: string[];
  color: string;
  status: CarStatus;
  provider_id: string;
  country_id: number;
  region_id: number;
  pricePerDay: number;
  minimumRentalPeriodInDays: number;
  maximumRentalPeriodInDays: number;
}

// User request
interface IReqUserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  city?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}

// Provider request
interface IReqProviderProps {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  businessRegistrationNumber: string;
  avatar?: string;
  profileUrl?: string;
  city: string;
  street: string;
  latitude: number;
  longitude: number;
  country_id: number;
  region_id: number;
}
```

### Response Types

```typescript
// Car response
interface IResCarProps extends IReqCarProps {
  id: number;
  created_at: string;
  updated_at: string;
}

// Country response
interface IResCountryProps {
  id: number;
  name: string;
  code: string;
}

// Region response
interface IResRegionProps {
  id: number;
  name: string;
  country_id: number;
}

// Booking response
interface IBaseBookingProps {
  id: number;
  user_id: string;
  car_id: number;
  provider_id: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}
```

---

## 🔒 Authentication

All Server Actions automatically have access to the current session via Supabase middleware.

### Checking Authentication

```typescript
import { getSession } from '@/actions/session.actions';

export async function myServerAction() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  // Proceed with authenticated logic
}
```

### Role-Based Access

```typescript
import { isProviderSession } from '@/actions/session.actions';

export async function providerOnlyAction() {
  const isProvider = await isProviderSession();
  
  if (!isProvider) {
    throw new Error('Provider access required');
  }
  
  // Provider-only logic
}
```

---

## 🚀 Usage Examples

### Complete Booking Flow

```typescript
// 1. Search for cars
const cars = await getCarsAsync({
  country_id: 1,
  region_id: 2,
  minPrice: 50,
  maxPrice: 150
});

// 2. Get car details
const car = await getCarByIdAsync(cars[0].id);

// 3. Create booking
const booking = await createBookingAsync({
  car_id: car.id,
  provider_id: car.provider_id,
  pickupDate: '2025-02-01',
  returnDate: '2025-02-05',
  totalPrice: car.pricePerDay * 4
});

// 4. Provider approves
await updateBookingStatusAsync(booking.id, 'approved');
```

### Provider Adding a Car

```typescript
// 1. Get session
const session = await getSession();

// 2. Upload images
const imageUrls = await Promise.all(
  images.map(img => uploadToCloudinary(img))
);

// 3. Create car
const car = await addCarAsync({
  make: 'Tesla',
  model: 'Model 3',
  year: 2024,
  images: imageUrls,
  pricePerDay: 120,
  provider_id: session.user.id,
  // ... other fields
});
```

---

## 📚 Additional Resources

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase Client](https://supabase.com/docs/reference/javascript/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
