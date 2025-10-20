# 👥 Guía de Roles y Usuarios - RentRide

## 🎭 Sistema de Roles

RentRide tiene **2 roles principales** que determinan qué puede hacer cada usuario en la aplicación.

---

## 1. 👤 CUSTOMER (Cliente/Usuario)

### ¿Qué es?
Un cliente que busca rentar autos.

### Tabla en la Base de Datos
- **Tabla:** `public.users`
- **Referencia:** `auth.users.id`

### Permisos y Capacidades

✅ **Puede hacer:**
- Buscar autos disponibles
- Ver detalles de autos
- Crear reservas (bookings)
- Ver sus propias reservas
- Cancelar reservas pendientes
- Dejar reseñas en autos que rentó
- Editar su perfil
- Ver perfiles de proveedores

❌ **NO puede hacer:**
- Publicar autos
- Aprobar/rechazar reservas
- Ver reservas de otros usuarios
- Gestionar flota de vehículos

### Datos del Perfil
```typescript
interface Customer {
  id: UUID;              // Mismo que auth.users.id
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  dateofbirth?: Date;
  gender?: string;
  avatar?: string;
  city?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  country_id?: number;
  region_id?: number;
}
```

---

## 2. 🏢 PROVIDER (Proveedor/Empresa)

### ¿Qué es?
Una empresa o persona que renta autos a los clientes.

### Tabla en la Base de Datos
- **Tabla:** `public.providers`
- **Referencia:** `auth.users.id`

### Permisos y Capacidades

✅ **Puede hacer:**
- Publicar autos en la plataforma
- Gestionar su flota de vehículos
- Ver todas las reservas de sus autos
- Aprobar reservas pendientes
- Rechazar reservas
- Marcar reservas como completadas
- Ver estadísticas de su negocio
- Editar su perfil de empresa
- Ver perfiles de clientes que reservaron

❌ **NO puede hacer:**
- Hacer reservas (es quien recibe reservas)
- Ver autos de otros proveedores (backend)
- Gestionar autos de otros proveedores

### Datos del Perfil
```typescript
interface Provider {
  id: UUID;                        // Mismo que auth.users.id
  companyname: string;             // Nombre de la empresa
  contactname?: string;            // Persona de contacto
  email: string;
  phone?: string;
  businessregistrationnumber?: string;  // RUC/RFC/Tax ID
  avatar?: string;                 // Logo de la empresa
  profileurl?: string;             // Website
  city?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  country_id?: number;
  region_id?: number;
}
```

---

## 🔄 Flujo de Registro

### Para CUSTOMERS (Clientes)

```
1. Usuario se registra en /signup
   ↓
2. Supabase crea usuario en auth.users
   ↓
3. Trigger automático crea perfil en public.users
   ↓
4. Usuario puede iniciar sesión y buscar autos
```

**Código de ejemplo:**
```typescript
// 1. Registro
const { data, error } = await supabase.auth.signUp({
  email: 'cliente@example.com',
  password: 'password123'
});

// 2. El trigger crea automáticamente el perfil en public.users

// 3. Actualizar perfil (opcional)
await supabase
  .from('users')
  .update({
    firstname: 'Juan',
    lastname: 'Pérez',
    phone: '+1-555-0100'
  })
  .eq('id', user.id);
```

### Para PROVIDERS (Proveedores)

```
1. Usuario se registra en /signup-provider
   ↓
2. Supabase crea usuario en auth.users
   ↓
3. Aplicación crea perfil en public.providers
   ↓
4. Proveedor puede iniciar sesión y publicar autos
```

**Código de ejemplo:**
```typescript
// 1. Registro
const { data: authData, error } = await supabase.auth.signUp({
  email: 'empresa@example.com',
  password: 'password123'
});

// 2. Crear perfil de proveedor
await supabase
  .from('providers')
  .insert({
    id: authData.user.id,
    companyname: 'Premium Car Rentals',
    email: 'empresa@example.com',
    contactname: 'John Smith',
    phone: '+1-555-0200',
    businessregistrationnumber: 'BRN-12345'
  });
```

---

## 🔐 Seguridad (RLS Policies)

### Políticas para CUSTOMERS

```sql
-- Ver solo su propio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Actualizar solo su propio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Crear solo sus propias reservas
CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ver solo sus propias reservas
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);
```

### Políticas para PROVIDERS

```sql
-- Ver solo su propio perfil
CREATE POLICY "Providers can view own profile"
  ON providers FOR SELECT
  USING (auth.uid() = id);

-- Gestionar solo sus propios autos
CREATE POLICY "Providers can manage own cars"
  ON cars FOR ALL
  USING (auth.uid() = provider_id);

-- Ver reservas de sus autos
CREATE POLICY "Providers can view bookings for their cars"
  ON bookings FOR SELECT
  USING (auth.uid() = provider_id);

-- Actualizar estado de reservas de sus autos
CREATE POLICY "Providers can update booking status"
  ON bookings FOR UPDATE
  USING (auth.uid() = provider_id);
```

---

## 🧪 Cómo Probar el Sistema

### Opción 1: Desde la Aplicación (Recomendado)

#### Probar como CUSTOMER:
1. Ir a `/signup`
2. Registrarse con email y password
3. Confirmar email (si está habilitado)
4. Iniciar sesión
5. Buscar autos disponibles
6. Hacer una reserva

#### Probar como PROVIDER:
1. Ir a `/signup-provider` (o la ruta que uses)
2. Registrarse con datos de empresa
3. Confirmar email
4. Iniciar sesión
5. Publicar un auto
6. Ver reservas recibidas

### Opción 2: Desde Supabase Dashboard

#### Crear un CUSTOMER:
1. Ir a **Authentication → Users**
2. Click en **Add User**
3. Ingresar email y password
4. El trigger creará automáticamente el perfil en `public.users`
5. Ir a **Table Editor → users** para completar el perfil

#### Crear un PROVIDER:
1. Ir a **Authentication → Users**
2. Click en **Add User**
3. Ingresar email y password
4. Ir a **Table Editor → providers**
5. Click en **Insert → Insert row**
6. Usar el mismo UUID del usuario de auth
7. Completar datos de la empresa

### Opción 3: Con SQL (Para Testing)

```sql
-- 1. Primero crear usuario en auth (desde Dashboard)
-- Luego obtener su ID

-- 2. Crear perfil de proveedor
INSERT INTO public.providers (
  id,
  companyname,
  email,
  phone,
  city,
  country_id,
  region_id
) VALUES (
  'UUID-DEL-USUARIO-AUTH',
  'Test Car Rentals',
  'test@example.com',
  '+1-555-0100',
  'Los Angeles',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California')
);

-- 3. Crear un auto de prueba
INSERT INTO public.cars (
  make,
  model,
  year,
  type,
  transmission,
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
  provider_id,
  country_id,
  region_id
) VALUES (
  'Toyota',
  'Camry',
  2024,
  'sedan',
  'automatic',
  'petrol',
  'Comfortable sedan perfect for city driving',
  5,
  3,
  4,
  true,
  true,
  'Silver',
  'available',
  45.00,
  1,
  'UUID-DEL-PROVEEDOR',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California')
);
```

---

## 🔍 Verificar Roles de Usuarios

### Consulta SQL para ver todos los usuarios y sus roles:

```sql
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.users WHERE id = u.id) THEN 'Customer'
    WHEN EXISTS (SELECT 1 FROM public.providers WHERE id = u.id) THEN 'Provider'
    ELSE 'Sin Rol'
  END as role,
  COALESCE(
    (SELECT firstname || ' ' || lastname FROM public.users WHERE id = u.id),
    (SELECT companyname FROM public.providers WHERE id = u.id)
  ) as name,
  u.created_at
FROM auth.users u
ORDER BY u.created_at DESC;
```

---

## 📊 Flujos de Negocio

### Flujo de Reserva (Customer → Provider)

```
1. CUSTOMER busca autos
   ↓
2. CUSTOMER selecciona auto y fechas
   ↓
3. Sistema verifica disponibilidad
   ↓
4. CUSTOMER crea reserva (status: 'pending')
   ↓
5. PROVIDER recibe notificación
   ↓
6. PROVIDER revisa reserva
   ↓
7a. PROVIDER aprueba (status: 'approved')
    → Auto cambia a 'booked'
    ↓
7b. PROVIDER rechaza (status: 'rejected')
    → Auto sigue 'available'
    ↓
8. Después de la renta, PROVIDER marca como completada
   ↓
9. CUSTOMER puede dejar reseña
```

### Estados de Reserva

- **pending**: Esperando aprobación del proveedor
- **approved**: Aprobada por el proveedor
- **rejected**: Rechazada por el proveedor
- **completed**: Renta finalizada
- **cancelled**: Cancelada por el cliente

### Estados de Auto

- **available**: Disponible para rentar
- **pending**: Con reserva pendiente
- **booked**: Reservado/rentado
- **maintenance**: En mantenimiento
- **inactive**: Desactivado temporalmente

---

## 🎯 Funciones Útiles

### Verificar si un usuario es Provider:

```typescript
const isProvider = async (userId: string) => {
  const { data } = await supabase
    .from('providers')
    .select('id')
    .eq('id', userId)
    .single();
  
  return !!data;
};
```

### Verificar si un usuario es Customer:

```typescript
const isCustomer = async (userId: string) => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();
  
  return !!data;
};
```

### Obtener rol del usuario actual:

```typescript
const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verificar si es provider
  const { data: provider } = await supabase
    .from('providers')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (provider) return 'provider';

  // Verificar si es customer
  const { data: customer } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (customer) return 'customer';

  return null;
};
```

---

## 🚨 Errores Comunes

### Error: "Usuario no aparece en la tabla"
**Causa:** El perfil no se creó en `public.users` o `public.providers`
**Solución:** Verificar que el trigger automático esté funcionando o crear el perfil manualmente

### Error: "Foreign key constraint violation"
**Causa:** Intentando crear provider/user sin que exista en `auth.users`
**Solución:** Primero crear el usuario en auth, luego el perfil

### Error: "RLS policy violation"
**Causa:** Intentando acceder a datos sin permisos
**Solución:** Verificar que el usuario esté autenticado y tenga el rol correcto

---

## 📚 Recursos Adicionales

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Schema](./database-schema.md)
- [API Reference](./api-reference.md)

---

**Última actualización:** 18 de Enero, 2025  
**Versión:** 1.0.0
