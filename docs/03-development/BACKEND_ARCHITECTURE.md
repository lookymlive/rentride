# Arquitectura del Backend - RentRide

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura de Capas](#arquitectura-de-capas)
- [Estructura de Directorios](#estructura-de-directorios)
- [Flujo de Datos](#flujo-de-datos)
- [Seguridad](#seguridad)
- [Manejo de Errores](#manejo-de-errores)
- [Optimizaciones](#optimizaciones)

---

## 🎯 Visión General

RentRide utiliza una arquitectura **Server-Side Rendering (SSR)** con Next.js 15, aprovechando:

- **Server Components** para renderizado del lado del servidor
- **Server Actions** para mutaciones de datos
- **Route Handlers** para APIs REST
- **Middleware** para autenticación y autorización

### Principios de Diseño

1. **Seguridad Primero**: Validación en servidor, autenticación robusta
2. **Rendimiento**: Queries optimizadas, caching estratégico
3. **Mantenibilidad**: Código documentado, separación de responsabilidades
4. **Escalabilidad**: Arquitectura modular y desacoplada

---

## 🛠️ Stack Tecnológico

### Core
- **Next.js 15.1.3** - Framework React con SSR
- **React 19** - Biblioteca UI
- **TypeScript 5.7** - Tipado estático

### Base de Datos
- **Supabase** - PostgreSQL como servicio
  - Autenticación integrada
  - Row Level Security (RLS)
  - Realtime subscriptions
  - Storage para archivos

### Librerías Clave
- **@supabase/ssr** - Cliente Supabase para SSR
- **@tanstack/react-query** - Gestión de estado del servidor
- **Mantine UI** - Componentes de interfaz
- **Cloudinary** - Gestión de imágenes

---

## 🏗️ Arquitectura de Capas

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, Client State)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Application Layer               │
│    (Server Actions, Route Handlers)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Business Logic Layer           │
│     (Services, Validators, Utils)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Data Access Layer              │
│    (Supabase Client, Database Queries)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Database Layer               │
│         (PostgreSQL/Supabase)           │
└─────────────────────────────────────────┘
```

### 1. Presentation Layer
**Ubicación**: `/src/app`, `/src/components`, `/src/features`

**Responsabilidades**:
- Renderizado de UI
- Manejo de eventos de usuario
- Estado del cliente (React Query)
- Validación de formularios

**Ejemplos**:
```typescript
// Server Component
export default async function CarsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const cars = await getSearchedCars({ country: 1, region: 1 });
  return <CarsList cars={cars} />;
}
```

### 2. Application Layer
**Ubicación**: `/src/actions`, `/src/app/api`

**Responsabilidades**:
- Server Actions para mutaciones
- Route Handlers para APIs
- Autenticación y autorización
- Orquestación de lógica de negocio

**Ejemplos**:
```typescript
// Server Action
'use server';
export async function createBooking(data: BookingData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new AppError('Unauthorized', ErrorType.AUTH, 401);
  
  validateBookingData(data);
  return await bookingService.create(data, user.id);
}
```

### 3. Business Logic Layer
**Ubicación**: `/src/services`, `/src/lib`

**Responsabilidades**:
- Lógica de negocio reutilizable
- Validaciones complejas
- Transformación de datos
- Utilidades compartidas

**Ejemplos**:
```typescript
// Service
export class BookingService {
  async create(data: BookingData, userId: string) {
    // Validar disponibilidad
    const available = await this.checkAvailability(data);
    if (!available) throw new AppError('Car not available');
    
    // Calcular precio
    const price = this.calculatePrice(data);
    
    // Crear reserva
    return await supabase.from('bookings').insert({ ...data, userId, price });
  }
}
```

### 4. Data Access Layer
**Ubicación**: `/src/services/supabase.service.ts`, `/src/lib/supabase-server.ts`

**Responsabilidades**:
- Abstracción de acceso a datos
- Queries a la base de datos
- Manejo de conexiones
- Caching de datos

---

## 📁 Estructura de Directorios

```
src/
├── actions/              # Server Actions
│   ├── cars.actions.ts
│   ├── providers.actions.ts
│   ├── session.actions.ts
│   └── users.actions.ts
│
├── app/                  # Next.js App Router
│   ├── (main)/          # Layout principal
│   ├── (provider)/      # Layout de proveedores
│   ├── api/             # Route Handlers
│   └── middleware.ts    # Middleware global
│
├── components/          # Componentes compartidos
│   ├── ui/             # Componentes UI base
│   └── forms/          # Componentes de formularios
│
├── features/           # Módulos por funcionalidad
│   ├── cars/
│   ├── providers/
│   └── my-account/
│
├── lib/                # Utilidades y helpers
│   ├── supabase-server.ts    # Cliente Supabase servidor
│   ├── error-handler.ts      # Manejo de errores
│   └── validators.ts         # Validadores
│
├── models/             # Tipos TypeScript
│   ├── app.ts
│   ├── req.model.ts
│   ├── res.model.ts
│   └── supabase.ts     # Tipos generados de DB
│
├── services/           # Servicios de negocio
│   └── supabase.service.ts
│
└── middleware.ts       # Middleware de autenticación
```

---

## 🔄 Flujo de Datos

### Lectura de Datos (Query)

```
Usuario → Página (Server Component)
           ↓
       getSession() [Validar autenticación]
           ↓
       Server Action (e.g., getSearchedCars)
           ↓
       createSupabaseServerClient()
           ↓
       Query a Supabase
           ↓
       Transformación de datos
           ↓
       Retorno a componente
           ↓
       Renderizado SSR
```

### Escritura de Datos (Mutation)

```
Usuario → Formulario (Client Component)
           ↓
       Validación cliente (opcional)
           ↓
       Server Action (e.g., createBooking)
           ↓
       Validación servidor (obligatoria)
           ↓
       Verificar autenticación
           ↓
       Lógica de negocio
           ↓
       Mutation a Supabase
           ↓
       Revalidación de cache
           ↓
       Respuesta al cliente
```

---

## 🔒 Seguridad

### 1. Autenticación

**Implementación Segura**:
```typescript
// ❌ INCORRECTO - Solo lee cookies sin validar
const { data: { session } } = await supabase.auth.getSession();

// ✅ CORRECTO - Valida token con servidor
const { data: { user } } = await supabase.auth.getUser();
```

**Razón**: `getSession()` solo lee las cookies sin validar el token contra el servidor de Supabase Auth, lo que puede ser inseguro si las cookies son manipuladas.

### 2. Autorización

**Row Level Security (RLS)**:
```sql
-- Política: Los usuarios solo pueden ver sus propias reservas
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los proveedores solo pueden editar sus propios vehículos
CREATE POLICY "Providers can edit own cars"
ON cars FOR UPDATE
USING (auth.uid() = provider_id);
```

### 3. Validación de Datos

**Siempre validar en el servidor**:
```typescript
export async function updateProfile(data: ProfileData) {
  // 1. Validar autenticación
  const user = await getAuthenticatedUser();
  if (!user) throw new AppError('Unauthorized', ErrorType.AUTH, 401);
  
  // 2. Validar datos
  validateUserData(data);
  
  // 3. Sanitizar entrada
  const sanitized = {
    firstName: sanitizeString(data.firstName),
    lastName: sanitizeString(data.lastName),
  };
  
  // 4. Ejecutar operación
  return await updateUserAsync(sanitized, user.id);
}
```

### 4. Protección contra Inyección SQL

Supabase maneja esto automáticamente, pero siempre:
- Usar queries parametrizadas
- No construir queries con concatenación de strings
- Validar y sanitizar entrada

### 5. Variables de Entorno

```bash
# Públicas (prefijo NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Privadas (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # ⚠️ NUNCA exponer al cliente
CLOUDINARY_API_SECRET=xxx            # ⚠️ NUNCA exponer al cliente
```

---

## ⚠️ Manejo de Errores

### Sistema Centralizado

```typescript
// 1. Definir error tipado
throw new AppError(
  'User not found',
  ErrorType.NOT_FOUND,
  404,
  true,
  { userId: '123' }
);

// 2. Capturar y manejar
try {
  await someOperation();
} catch (error) {
  const handled = handleError(error, { operation: 'someOperation' });
  return { error: handled.message };
}

// 3. Logging estructurado
logError(error, { userId, operation: 'createBooking' });
```

### Tipos de Errores

| Tipo | Código HTTP | Uso |
|------|-------------|-----|
| `AUTH` | 401 | Usuario no autenticado |
| `AUTHORIZATION` | 403 | Sin permisos |
| `VALIDATION` | 400 | Datos inválidos |
| `NOT_FOUND` | 404 | Recurso no existe |
| `DATABASE` | 500 | Error de BD |
| `NETWORK` | 500 | Error de red |
| `INTERNAL` | 500 | Error inesperado |

---

## ⚡ Optimizaciones

### 1. Queries Paralelas

```typescript
// ❌ Secuencial (lento)
const user = await getUser(id);
const bookings = await getBookings(id);
const reviews = await getReviews(id);

// ✅ Paralelo (rápido)
const [user, bookings, reviews] = await Promise.all([
  getUser(id),
  getBookings(id),
  getReviews(id),
]);
```

### 2. Select Específico

```typescript
// ❌ Traer todos los campos
const cars = await supabase.from('cars').select('*');

// ✅ Solo campos necesarios
const cars = await supabase
  .from('cars')
  .select('id, make, model, pricePerDay, images');
```

### 3. Paginación

```typescript
const { data, count } = await supabase
  .from('cars')
  .select('*', { count: 'exact' })
  .range(0, 9)  // Primeros 10 resultados
  .order('created_at', { ascending: false });
```

### 4. Índices de Base de Datos

```sql
-- Índice para búsquedas frecuentes
CREATE INDEX idx_cars_location ON cars(country_id, region_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
```

### 5. Caching con React Query

```typescript
const { data: cars } = useQuery({
  queryKey: ['cars', filters],
  queryFn: () => getSearchedCars(filters),
  staleTime: 5 * 60 * 1000,  // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});
```

---

## 📊 Monitoreo y Logging

### Logs Estructurados

```typescript
console.log('[INFO]', {
  timestamp: new Date().toISOString(),
  operation: 'createBooking',
  userId: user.id,
  carId: car.id,
  duration: Date.now() - startTime,
});
```

### Métricas Clave

- Tiempo de respuesta de queries
- Tasa de errores por endpoint
- Uso de recursos (memoria, CPU)
- Número de usuarios activos

---

## 🔄 Actualización y Mantenimiento

### Versionado de Base de Datos

```bash
# Crear nueva migración
npm run db:migrate

# Generar tipos TypeScript
npm run db:generate-types
```

### Despliegue

1. Ejecutar tests
2. Build de producción
3. Ejecutar migraciones
4. Deploy a Vercel/Netlify
5. Verificar health checks

---

## 📚 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

**Última actualización**: 2025-01-19  
**Versión**: 1.0.0  
**Mantenedor**: Equipo de Desarrollo RentRide
