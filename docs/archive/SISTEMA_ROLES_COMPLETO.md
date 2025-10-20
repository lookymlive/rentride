# 🎭 Sistema de Roles RentRide - Guía Completa

## 📊 Estado Actual del Sistema

| Métrica | Valor |
|---------|-------|
| 👥 Usuarios Totales | 1 |
| 👤 Customers | 1 |
| 🏢 Providers | 0 |
| 🚗 Autos Publicados | 0 |
| 📅 Reservas | 0 |
| ⭐ Reseñas | 0 |
| 🌍 Países | 15 |
| 📍 Regiones | 15 |

**Usuario actual:**
- Email: `luisdtv@gmail.com`
- Rol: **Customer** ✅
- ID: `00ad418f-d903-439b-bfdb-c31a3c49a672`

---

## 🎯 Sistema de 2 Roles

### 1. 👤 CUSTOMER (Cliente)
**Tabla:** `public.users`

**Puede hacer:**
- ✅ Buscar y ver autos
- ✅ Crear reservas
- ✅ Ver sus reservas
- ✅ Cancelar reservas pendientes
- ✅ Dejar reseñas (solo en autos que rentó)
- ✅ Editar su perfil

**NO puede hacer:**
- ❌ Publicar autos
- ❌ Aprobar/rechazar reservas
- ❌ Ver reservas de otros

### 2. 🏢 PROVIDER (Proveedor/Empresa)
**Tabla:** `public.providers`

**Puede hacer:**
- ✅ Publicar autos
- ✅ Gestionar su flota
- ✅ Ver reservas de sus autos
- ✅ Aprobar/rechazar reservas
- ✅ Marcar reservas como completadas
- ✅ Ver estadísticas de negocio

**NO puede hacer:**
- ❌ Hacer reservas (recibe reservas)
- ❌ Gestionar autos de otros

---

## 🔄 Cómo Funciona

### Arquitectura

```
auth.users (Supabase Auth)
    ├── email
    ├── password
    └── id (UUID)
         │
         ├─────> public.users (Customer)
         │       ├── firstname
         │       ├── lastname
         │       └── perfil completo
         │
         └─────> public.providers (Provider)
                 ├── companyname
                 ├── businessregistrationnumber
                 └── perfil de empresa
```

**Regla:** Un usuario puede ser SOLO Customer O SOLO Provider, no ambos.

---

## 📝 Cómo Crear Usuarios

### Opción 1: Desde la Aplicación (Recomendado)

#### Customer:
```typescript
// 1. Registro
const { data, error } = await supabase.auth.signUp({
  email: 'cliente@example.com',
  password: 'password123'
});

// 2. El trigger crea automáticamente el perfil en public.users ✅

// 3. Actualizar perfil (opcional)
await supabase
  .from('users')
  .update({
    firstname: 'Juan',
    lastname: 'Pérez'
  })
  .eq('id', user.id);
```

#### Provider:
```typescript
// 1. Registro
const { data, error } = await supabase.auth.signUp({
  email: 'empresa@example.com',
  password: 'password123'
});

// 2. Crear perfil de proveedor
await supabase
  .from('providers')
  .insert({
    id: data.user.id,
    companyname: 'Mi Empresa',
    email: 'empresa@example.com'
  });
```

### Opción 2: Desde Supabase Dashboard

#### Crear Customer:
1. **Authentication → Users → Add User**
2. Email: `cliente@test.com`
3. Password: `Test123456!`
4. El trigger crea automáticamente el perfil ✅

#### Crear Provider:
1. **Authentication → Users → Add User**
2. Email: `provider@test.com`
3. Password: `Test123456!`
4. Copiar el UUID generado
5. **Table Editor → providers → Insert row**
6. Pegar el UUID y completar datos

### Opción 3: Con SQL (Para Testing)

```sql
-- 1. Primero crear en Authentication (Dashboard)
-- 2. Copiar el UUID
-- 3. Crear perfil de provider

INSERT INTO public.providers (
  id,
  companyname,
  email,
  phone,
  city,
  country_id,
  region_id
) VALUES (
  'UUID-COPIADO-AQUI',
  'Premium Car Rentals',
  'provider@test.com',
  '+1-555-0200',
  'Los Angeles',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California')
);
```

---

## 🧪 Cómo Probar

### 1. Probar como Customer (Ya tienes uno)

**Tu usuario actual:** `luisdtv@gmail.com`

```
1. Iniciar sesión ✅
2. Completar perfil
3. Buscar autos (cuando haya autos publicados)
4. Hacer una reserva
5. Ver mis reservas
6. Dejar reseña
```

### 2. Crear y Probar como Provider

**Paso a paso:**

1. **Crear usuario provider en Dashboard:**
   - Ir a: https://app.supabase.com/project/ymbfktjlmzlepjujaxxw/auth/users
   - Click **Add User**
   - Email: `provider1@test.com`
   - Password: `Test123456!`
   - Click **Create User**
   - **Copiar el UUID** que aparece

2. **Crear perfil de provider con SQL:**
   ```sql
   INSERT INTO public.providers (
     id,
     companyname,
     contactname,
     email,
     phone,
     city,
     country_id,
     region_id
   ) VALUES (
     'PEGAR-UUID-AQUI',
     'Test Car Rentals',
     'John Doe',
     'provider1@test.com',
     '+1-555-0100',
     'Los Angeles',
     (SELECT id FROM countries WHERE code = 'USA'),
     (SELECT id FROM regions WHERE name = 'California')
   );
   ```

3. **Publicar un auto:**
   ```sql
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
     'UUID-DEL-PROVIDER',
     (SELECT id FROM countries WHERE code = 'USA'),
     (SELECT id FROM regions WHERE name = 'California')
   );
   ```

4. **Probar flujo completo:**
   ```
   Customer → Busca auto → Crea reserva
   Provider → Ve reserva → Aprueba
   Customer → Ve aprobación → Usa auto
   Provider → Marca como completada
   Customer → Deja reseña
   ```

---

## 🔍 Verificar Roles

### SQL para ver todos los usuarios y sus roles:

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

## 📊 Flujo de Negocio Completo

### Reserva de Auto (Customer → Provider)

```
1. CUSTOMER busca autos disponibles
   ↓
2. CUSTOMER selecciona auto y fechas
   ↓
3. Sistema verifica disponibilidad automáticamente
   ↓
4. CUSTOMER crea reserva
   - Estado: 'pending'
   - Auto: sigue 'available'
   ↓
5. PROVIDER recibe notificación
   ↓
6. PROVIDER revisa reserva y decide:
   
   A) APROBAR:
      - Reserva: 'pending' → 'approved'
      - Auto: 'available' → 'booked'
      - Customer recibe confirmación
   
   B) RECHAZAR:
      - Reserva: 'pending' → 'rejected'
      - Auto: sigue 'available'
      - Customer recibe notificación
   ↓
7. Después de la renta:
   PROVIDER marca como completada
   - Reserva: 'approved' → 'completed'
   - Auto: 'booked' → 'available'
   ↓
8. CUSTOMER puede dejar reseña
   - Solo si la reserva está 'completed'
   - Rating: 1-5 estrellas
   - Comentario opcional
```

### Estados de Reserva

| Estado | Descripción | Quién lo cambia |
|--------|-------------|-----------------|
| `pending` | Esperando aprobación | Sistema (al crear) |
| `approved` | Aprobada por proveedor | Provider |
| `rejected` | Rechazada por proveedor | Provider |
| `completed` | Renta finalizada | Provider |
| `cancelled` | Cancelada | Customer (solo si pending) |

### Estados de Auto

| Estado | Descripción | Cuándo |
|--------|-------------|--------|
| `available` | Disponible para rentar | Por defecto |
| `pending` | Con reserva pendiente | Opcional |
| `booked` | Reservado/rentado | Al aprobar reserva |
| `maintenance` | En mantenimiento | Manual |
| `inactive` | Desactivado | Manual |

---

## 🔐 Seguridad (RLS)

### Políticas Activas

**Customers:**
- ✅ Ver solo su propio perfil
- ✅ Crear solo sus propias reservas
- ✅ Ver solo sus propias reservas
- ✅ Cancelar solo sus reservas pendientes
- ✅ Crear reseñas solo en autos que rentaron

**Providers:**
- ✅ Ver solo su propio perfil
- ✅ Gestionar solo sus propios autos
- ✅ Ver solo reservas de sus autos
- ✅ Actualizar solo reservas de sus autos

**Público:**
- ✅ Ver autos disponibles
- ✅ Ver perfiles de proveedores
- ✅ Ver reseñas

---

## 🎯 Funciones SQL Disponibles

### 1. Verificar Disponibilidad
```sql
SELECT check_car_availability(
  1,                    -- car_id
  '2025-01-20',        -- pickup_date
  '2025-01-25'         -- return_date
);
-- Retorna: true/false
```

### 2. Buscar Autos
```sql
SELECT * FROM search_cars(
  p_country_id := 1,
  p_region_id := 2,
  p_min_price := 30,
  p_max_price := 100,
  p_car_type := 'sedan',
  p_limit := 10
);
```

### 3. Estadísticas de Provider
```sql
SELECT * FROM get_provider_stats('provider-uuid');
-- Retorna: total_cars, active_cars, bookings, revenue, etc.
```

### 4. Ver Reservas Próximas
```sql
SELECT * FROM upcoming_bookings;
```

### 5. Historial de Reservas
```sql
SELECT * FROM booking_history;
```

---

## 📚 Documentación Completa

- 📖 **Guía de Roles:** `docs/USER_ROLES_GUIDE.md`
- 🧪 **Guía de Testing:** `docs/TESTING_GUIDE.md`
- 🗄️ **Esquema de DB:** `docs/database-schema.md`
- 🚀 **Setup Supabase:** `docs/SUPABASE_SETUP.md`
- 📦 **Backend Setup:** `BACKEND_SETUP_COMPLETE.md`

---

## ✅ Checklist de Configuración

- [x] MCP Supabase configurado
- [x] Base de datos creada
- [x] Migraciones aplicadas
- [x] RLS policies activas
- [x] Triggers funcionando
- [x] Funciones SQL creadas
- [x] Usuario Customer creado
- [ ] Usuario Provider creado (pendiente)
- [ ] Autos de prueba publicados (pendiente)
- [ ] Reserva de prueba creada (pendiente)

---

## 🚀 Próximos Pasos

1. **Crear un Provider de prueba**
   - Seguir pasos en sección "Crear y Probar como Provider"

2. **Publicar autos de prueba**
   - Usar SQL o la interfaz de la app

3. **Probar flujo completo**
   - Customer busca → reserva
   - Provider aprueba
   - Customer deja reseña

4. **Configurar variables de entorno**
   - Obtener API keys de Supabase
   - Actualizar `.env.local`

5. **Probar en la aplicación**
   - Iniciar servidor: `npm run dev`
   - Probar todos los flujos

---

## 💡 Tips Importantes

1. **Un usuario = un rol**
   - No puedes ser Customer Y Provider al mismo tiempo
   - Usa diferentes emails para cada rol

2. **Trigger automático**
   - Los Customers se crean automáticamente al registrarse
   - Los Providers deben crearse manualmente (por ahora)

3. **RLS siempre activo**
   - No puedes ver datos de otros usuarios
   - Usa service_role key solo para admin

4. **Estados automáticos**
   - Los triggers actualizan estados automáticamente
   - No cambies estados manualmente en producción

---

**¿Necesitas ayuda?**
- Revisa `docs/TESTING_GUIDE.md` para instrucciones paso a paso
- Revisa `docs/USER_ROLES_GUIDE.md` para detalles de roles
- Pregúntame cualquier duda específica

**¡Tu sistema está listo para usar!** 🎉
