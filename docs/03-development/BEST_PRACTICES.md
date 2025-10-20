# Mejores Prácticas de Desarrollo - RentRide

## 📋 Tabla de Contenidos

- [Arquitectura y Diseño](#arquitectura-y-diseño)
- [Código Limpio](#código-limpio)
- [TypeScript](#typescript)
- [Next.js y React](#nextjs-y-react)
- [Supabase](#supabase)
- [Rendimiento](#rendimiento)
- [Testing](#testing)
- [Git y Control de Versiones](#git-y-control-de-versiones)

---

## 🏗️ Arquitectura y Diseño

### Separación de Responsabilidades

**✅ HACER**:
```typescript
// actions/users.actions.ts - Lógica de servidor
export async function getUserProfile(userId: string) {
  const user = await getUserDetails(userId);
  return user;
}

// components/UserProfile.tsx - Presentación
export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

**❌ EVITAR**:
```typescript
// Mezclar lógica de datos con presentación
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // ❌ Lógica de datos en componente de presentación
    fetch(`/api/users/${userId}`).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

### Principio DRY (Don't Repeat Yourself)

**✅ HACER**:
```typescript
// lib/supabase-server.ts - Helper reutilizable
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(/* ... */);
};

// Usar en múltiples lugares
const supabase = await createSupabaseServerClient();
```

**❌ EVITAR**:
```typescript
// Repetir código en cada archivo
const cookieStore = await cookies();
const supabase = createServerClient(/* ... */);
```

### Single Responsibility Principle

Cada función/clase debe tener una sola responsabilidad.

**✅ HACER**:
```typescript
// Funciones específicas
export const validateEmail = (email: string) => { /* ... */ };
export const sanitizeString = (str: string) => { /* ... */ };
export const hashPassword = (password: string) => { /* ... */ };
```

**❌ EVITAR**:
```typescript
// Función que hace demasiado
export const processUser = (data: any) => {
  // Valida
  // Sanitiza
  // Hashea
  // Guarda en BD
  // Envía email
  // ❌ Demasiadas responsabilidades
};
```

---

## 💎 Código Limpio

### Nombres Descriptivos

**✅ HACER**:
```typescript
const getUserBookingsByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  // Nombre claro y descriptivo
};
```

**❌ EVITAR**:
```typescript
const getUBDR = async (u: string, sd: Date, ed: Date) => {
  // ❌ Abreviaciones confusas
};
```

### Funciones Pequeñas

Mantener funciones cortas (idealmente < 20 líneas).

**✅ HACER**:
```typescript
export const createBooking = async (data: BookingData) => {
  await validateBookingData(data);
  const price = calculateTotalPrice(data);
  const booking = await saveBooking({ ...data, price });
  await sendConfirmationEmail(booking);
  return booking;
};

// Funciones auxiliares pequeñas y enfocadas
const validateBookingData = (data: BookingData) => { /* ... */ };
const calculateTotalPrice = (data: BookingData) => { /* ... */ };
const saveBooking = (data: BookingData) => { /* ... */ };
```

**❌ EVITAR**:
```typescript
export const createBooking = async (data: BookingData) => {
  // ❌ 100 líneas de código haciendo todo
  // Validación
  // Cálculos
  // Guardado
  // Emails
  // Notificaciones
  // etc...
};
```

### Comentarios Útiles

**✅ HACER**:
```typescript
/**
 * Calcula el precio total de una reserva incluyendo impuestos y cargos adicionales
 * @param days - Número de días de la reserva
 * @param pricePerDay - Precio base por día
 * @returns Precio total con impuestos
 */
export const calculateTotalPrice = (days: number, pricePerDay: number): number => {
  const basePrice = days * pricePerDay;
  const tax = basePrice * 0.21; // IVA 21%
  const serviceFee = 500; // Cargo fijo de servicio
  return basePrice + tax + serviceFee;
};
```

**❌ EVITAR**:
```typescript
// Calcula precio
export const calc = (d: number, p: number) => {
  const b = d * p; // base
  const t = b * 0.21; // tax
  const s = 500; // service
  return b + t + s; // total
};
```

### Manejo de Errores Consistente

**✅ HACER**:
```typescript
export const getUserProfile = async (userId: string) => {
  try {
    validateUUID(userId);
    const user = await fetchUser(userId);
    
    if (!user) {
      throw new AppError('User not found', ErrorType.NOT_FOUND, 404);
    }
    
    return user;
  } catch (error) {
    logError(error, { operation: 'getUserProfile', userId });
    throw error;
  }
};
```

**❌ EVITAR**:
```typescript
export const getUserProfile = async (userId: string) => {
  const user = await fetchUser(userId);
  return user; // ❌ Sin validación ni manejo de errores
};
```

---

## 📘 TypeScript

### Tipado Estricto

**✅ HACER**:
```typescript
interface BookingData {
  carId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

export const createBooking = async (data: BookingData): Promise<Booking> => {
  // Tipos explícitos
};
```

**❌ EVITAR**:
```typescript
export const createBooking = async (data: any): Promise<any> => {
  // ❌ Uso de 'any'
};
```

### Evitar Type Assertions

**✅ HACER**:
```typescript
const car = await supabase
  .from('cars')
  .select('*')
  .eq('id', carId)
  .single();

if (!car.data) {
  throw new AppError('Car not found', ErrorType.NOT_FOUND, 404);
}

// TypeScript sabe que car.data existe
const carData: Car = car.data;
```

**❌ EVITAR**:
```typescript
const car = await supabase.from('cars').select('*').eq('id', carId).single();
const carData = car.data as Car; // ❌ Type assertion sin validación
```

### Interfaces vs Types

**Usar Interfaces** para objetos que pueden extenderse:
```typescript
interface User {
  id: string;
  name: string;
}

interface Provider extends User {
  companyName: string;
}
```

**Usar Types** para uniones, intersecciones y tipos complejos:
```typescript
type Status = 'pending' | 'confirmed' | 'cancelled';
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

### Generics

**✅ HACER**:
```typescript
export const fetchData = async <T>(
  table: string,
  id: string
): Promise<T | null> => {
  const { data } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  return data as T | null;
};

// Uso
const car = await fetchData<Car>('cars', carId);
```

---

## ⚛️ Next.js y React

### Server vs Client Components

**Server Components** (por defecto):
```typescript
// app/cars/page.tsx
export default async function CarsPage() {
  // ✅ Fetch de datos en el servidor
  const cars = await getSearchedCars();
  
  return <CarsList cars={cars} />;
}
```

**Client Components** (cuando sea necesario):
```typescript
'use client';

// Solo cuando necesites:
// - useState, useEffect, hooks
// - Event handlers
// - Browser APIs
export function SearchForm() {
  const [query, setQuery] = useState('');
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

### Server Actions

**✅ HACER**:
```typescript
'use server';

export async function createBooking(formData: FormData) {
  // 1. Validar autenticación
  const user = await getAuthenticatedUser();
  if (!user) throw new AppError('Unauthorized', ErrorType.AUTH, 401);
  
  // 2. Extraer y validar datos
  const data = {
    carId: formData.get('carId') as string,
    startDate: new Date(formData.get('startDate') as string),
    endDate: new Date(formData.get('endDate') as string),
  };
  
  validateBookingData(data);
  
  // 3. Ejecutar lógica de negocio
  const booking = await saveBooking(data, user.id);
  
  // 4. Revalidar cache
  revalidatePath('/bookings');
  
  return { success: true, booking };
}
```

### React Query para Client State

**✅ HACER**:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function CarsList() {
  const { data: cars, isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await fetch('/api/cars');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return <div>{cars.map(car => <CarCard key={car.id} car={car} />)}</div>;
}
```

---

## 🗄️ Supabase

### Seguridad Primero

**✅ HACER**:
```typescript
// Siempre usar getUser() en el servidor
const { data: { user }, error } = await supabase.auth.getUser();
```

**❌ EVITAR**:
```typescript
// ❌ getSession() no valida con el servidor
const { data: { session } } = await supabase.auth.getSession();
```

### Row Level Security (RLS)

**Siempre habilitar RLS**:
```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);
```

### Queries Optimizadas

**✅ HACER**:
```typescript
// Select solo campos necesarios
const { data } = await supabase
  .from('cars')
  .select('id, make, model, pricePerDay, images')
  .eq('status', 'available')
  .order('created_at', { ascending: false })
  .limit(10);
```

**❌ EVITAR**:
```typescript
// ❌ Select * trae todos los campos
const { data } = await supabase.from('cars').select('*');
```

### Joins Eficientes

**✅ HACER**:
```typescript
// Join en una sola query
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    cars (
      make,
      model,
      images
    ),
    users (
      firstName,
      lastName
    )
  `)
  .eq('user_id', userId);
```

**❌ EVITAR**:
```typescript
// ❌ Múltiples queries separadas
const bookings = await supabase.from('bookings').select('*');
for (const booking of bookings) {
  const car = await supabase.from('cars').select('*').eq('id', booking.car_id);
  // N+1 problem
}
```

---

## ⚡ Rendimiento

### Lazy Loading de Componentes

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Solo cargar en cliente si es necesario
});
```

### Optimización de Imágenes

```typescript
import Image from 'next/image';

export function CarImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

### Memoización

```typescript
import { useMemo } from 'react';

export function ExpensiveComponent({ data }: { data: Data[] }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);
  
  return <div>{processedData}</div>;
}
```

### Parallel Data Fetching

```typescript
// ✅ Paralelo
const [user, cars, bookings] = await Promise.all([
  getUser(id),
  getCars(id),
  getBookings(id),
]);

// ❌ Secuencial
const user = await getUser(id);
const cars = await getCars(id);
const bookings = await getBookings(id);
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotalPrice } from './pricing';

describe('calculateTotalPrice', () => {
  it('should calculate price correctly', () => {
    const result = calculateTotalPrice(3, 1000);
    expect(result).toBe(3630); // 3000 + 21% IVA + 500 cargo
  });
  
  it('should throw error for negative days', () => {
    expect(() => calculateTotalPrice(-1, 1000)).toThrow();
  });
});
```

### Integration Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createBooking } from './bookings.actions';

describe('createBooking', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });
  
  it('should create booking successfully', async () => {
    const booking = await createBooking({
      carId: 'car-1',
      userId: 'user-1',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-01-23'),
    });
    
    expect(booking).toBeDefined();
    expect(booking.status).toBe('pending');
  });
});
```

---

## 📝 Git y Control de Versiones

### Commits Semánticos

```bash
# Formato: tipo(scope): descripción

feat(auth): add password reset functionality
fix(booking): resolve date validation bug
docs(api): update API reference
refactor(users): simplify user profile logic
test(cars): add unit tests for car search
chore(deps): update dependencies
```

### Branches

```bash
# Feature branches
git checkout -b feature/user-authentication
git checkout -b feature/booking-system

# Bugfix branches
git checkout -b fix/date-validation
git checkout -b fix/image-upload

# Hotfix branches (producción)
git checkout -b hotfix/security-patch
```

### Pull Requests

**Template de PR**:
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Tests añadidos/actualizados
- [ ] Documentación actualizada
- [ ] Código revisado
- [ ] Sin warnings de TypeScript
```

---

## 📚 Recursos Adicionales

- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/routing/best-practices)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Supabase Best Practices](https://supabase.com/docs/guides/database/best-practices)
- [Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Última actualización**: 2025-01-19  
**Versión**: 1.0.0  
**Mantenedor**: Equipo de Desarrollo RentRide
