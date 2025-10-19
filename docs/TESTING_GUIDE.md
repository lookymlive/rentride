# 🧪 Guía de Testing - RentRide

## Cómo Probar tu Aplicación Paso a Paso

Esta guía te muestra cómo probar todas las funcionalidades de RentRide.

---

## 📋 Pre-requisitos

- ✅ Backend Supabase configurado
- ✅ Variables de entorno configuradas (`.env.local`)
- ✅ Aplicación corriendo en `http://localhost:3000`

---

## 🎯 Escenario 1: Probar como CUSTOMER (Cliente)

### Paso 1: Crear Cuenta de Cliente

**Desde la Aplicación:**
1. Ir a `http://localhost:3000/signup`
2. Completar el formulario:
   - Email: `cliente1@test.com`
   - Password: `Test123456!`
   - Confirmar password
3. Click en **Registrarse**
4. Verificar email (si está habilitado)

**Desde Supabase Dashboard:**
1. Ir a **Authentication → Users**
2. Click **Add User**
3. Email: `cliente1@test.com`
4. Password: `Test123456!`
5. Click **Create User**
6. El perfil se crea automáticamente en `public.users`

### Paso 2: Completar Perfil

1. Iniciar sesión con `cliente1@test.com`
2. Ir a **Mi Cuenta** o **Perfil**
3. Completar datos:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: +1-555-0100
   - Ciudad: Los Angeles
   - País: United States
   - Región: California
4. Guardar cambios

### Paso 3: Buscar Autos

1. Ir a la página principal o **Buscar Autos**
2. Aplicar filtros:
   - País: United States
   - Región: California
   - Rango de precio: $30 - $100
   - Tipo: Sedan
3. Ver resultados

### Paso 4: Ver Detalles de un Auto

1. Click en un auto de los resultados
2. Ver:
   - Fotos del auto
   - Especificaciones
   - Precio por día
   - Ubicación
   - Reseñas
   - Información del proveedor

### Paso 5: Hacer una Reserva

1. Seleccionar fechas:
   - Fecha de recogida: Mañana
   - Fecha de devolución: En 3 días
2. Verificar disponibilidad
3. Ver precio total calculado
4. Agregar notas (opcional)
5. Click **Reservar**
6. Verificar que aparece en **Mis Reservas**

### Paso 6: Ver Mis Reservas

1. Ir a **Mi Cuenta → Mis Reservas**
2. Ver lista de reservas con estados:
   - 🟡 Pendiente (esperando aprobación)
   - 🟢 Aprobada
   - 🔴 Rechazada
   - ✅ Completada
   - ❌ Cancelada

### Paso 7: Cancelar una Reserva

1. En **Mis Reservas**, seleccionar una reserva pendiente
2. Click **Cancelar Reserva**
3. Confirmar cancelación
4. Verificar que el estado cambió a "Cancelada"

### Paso 8: Dejar una Reseña

1. Ir a una reserva completada
2. Click **Dejar Reseña**
3. Seleccionar calificación (1-5 estrellas)
4. Escribir comentario
5. Enviar reseña
6. Verificar que aparece en el auto

---

## 🏢 Escenario 2: Probar como PROVIDER (Proveedor)

### Paso 1: Crear Cuenta de Proveedor

**Desde Supabase Dashboard (Recomendado para testing):**

```sql
-- 1. Primero crear usuario en Authentication → Users
-- Email: provider1@test.com
-- Password: Test123456!
-- Copiar el UUID generado

-- 2. Crear perfil de proveedor
INSERT INTO public.providers (
  id,
  companyname,
  contactname,
  email,
  phone,
  businessregistrationnumber,
  city,
  street,
  country_id,
  region_id
) VALUES (
  'PEGAR-UUID-AQUI',
  'Premium Car Rentals',
  'John Smith',
  'provider1@test.com',
  '+1-555-0200',
  'BRN-12345',
  'Los Angeles',
  '123 Main Street',
  (SELECT id FROM countries WHERE code = 'USA'),
  (SELECT id FROM regions WHERE name = 'California')
);
```

### Paso 2: Completar Perfil de Empresa

1. Iniciar sesión como `provider1@test.com`
2. Ir a **Dashboard de Proveedor**
3. Completar perfil:
   - Logo de empresa
   - Sitio web
   - Dirección completa
   - Coordenadas en el mapa
4. Guardar cambios

### Paso 3: Publicar un Auto

1. Ir a **Mis Autos → Agregar Auto**
2. Completar información básica:
   - Marca: Toyota
   - Modelo: Camry
   - Año: 2024
   - Tipo: Sedan
   - Transmisión: Automática
   - Combustible: Gasolina
3. Especificaciones:
   - Asientos: 5
   - Maletas: 3
   - Puertas: 4
   - Aire acondicionado: ✅ Sí
4. Precio y disponibilidad:
   - Precio por día: $45
   - Mínimo de días: 1
   - Máximo de días: 30
5. Ubicación:
   - País: United States
   - Región: California
6. Subir fotos (mínimo 3)
7. Características adicionales:
   - Bluetooth
   - Cámara trasera
   - Control crucero
8. Click **Publicar Auto**

### Paso 4: Ver Mis Autos

1. Ir a **Dashboard → Mis Autos**
2. Ver lista de autos publicados
3. Ver estados:
   - 🟢 Disponible
   - 🟡 Pendiente
   - 🔴 Reservado
   - 🔧 Mantenimiento

### Paso 5: Editar un Auto

1. Seleccionar un auto
2. Click **Editar**
3. Modificar información
4. Guardar cambios

### Paso 6: Gestionar Reservas

1. Ir a **Dashboard → Reservas**
2. Ver reservas recibidas:
   - Pendientes (requieren acción)
   - Aprobadas
   - Completadas
   - Rechazadas

### Paso 7: Aprobar una Reserva

1. Seleccionar una reserva pendiente
2. Ver detalles:
   - Cliente
   - Auto
   - Fechas
   - Precio total
3. Click **Aprobar**
4. Verificar que:
   - Estado cambió a "Aprobada"
   - Auto cambió a "Reservado"
   - Cliente recibe notificación

### Paso 8: Rechazar una Reserva

1. Seleccionar una reserva pendiente
2. Click **Rechazar**
3. Agregar motivo (opcional)
4. Confirmar
5. Verificar que:
   - Estado cambió a "Rechazada"
   - Auto vuelve a "Disponible"

### Paso 9: Completar una Reserva

1. Después de la fecha de devolución
2. Seleccionar reserva aprobada
3. Click **Marcar como Completada**
4. Verificar que:
   - Estado cambió a "Completada"
   - Auto vuelve a "Disponible"
   - Cliente puede dejar reseña

### Paso 10: Ver Estadísticas

1. Ir a **Dashboard → Estadísticas**
2. Ver métricas:
   - Total de autos
   - Autos disponibles
   - Reservas totales
   - Reservas pendientes
   - Reservas completadas
   - Ingresos totales

---

## 🔍 Escenario 3: Probar Búsqueda Avanzada

### Desde SQL (Testing Backend):

```sql
-- Buscar autos con filtros
SELECT * FROM search_cars(
  p_country_id := (SELECT id FROM countries WHERE code = 'USA'),
  p_region_id := (SELECT id FROM regions WHERE name = 'California'),
  p_min_price := 30,
  p_max_price := 100,
  p_car_type := 'sedan',
  p_transmission := 'automatic',
  p_pickup_date := CURRENT_DATE + 1,
  p_return_date := CURRENT_DATE + 4,
  p_limit := 10
);
```

### Desde la Aplicación:

1. Ir a **Buscar Autos**
2. Aplicar múltiples filtros:
   - Ubicación
   - Fechas
   - Precio
   - Tipo de auto
   - Transmisión
   - Combustible
   - Año mínimo
3. Verificar resultados filtrados
4. Ordenar por:
   - Precio (menor a mayor)
   - Precio (mayor a menor)
   - Más recientes
   - Mejor calificados

---

## 🧪 Escenario 4: Probar Validaciones

### Validación de Disponibilidad

**Crear reserva conflictiva:**
1. Como Cliente 1, reservar Auto A del 20 al 25 de enero
2. Como Cliente 2, intentar reservar el mismo Auto A del 22 al 27
3. **Resultado esperado:** Error "Auto no disponible"

**SQL para verificar:**
```sql
-- Verificar disponibilidad
SELECT check_car_availability(
  1,  -- car_id
  '2025-01-22',  -- pickup_date
  '2025-01-27'   -- return_date
);
-- Debe retornar: false
```

### Validación de Período Mínimo

**Intentar reserva menor al mínimo:**
1. Auto con mínimo 2 días
2. Intentar reservar por 1 día
3. **Resultado esperado:** Error "Mínimo 2 días"

### Validación de Período Máximo

**Intentar reserva mayor al máximo:**
1. Auto con máximo 14 días
2. Intentar reservar por 20 días
3. **Resultado esperado:** Error "Máximo 14 días"

---

## 📊 Escenario 5: Verificar Datos en la Base de Datos

### Ver todos los usuarios y sus roles:

```sql
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.users WHERE id = u.id) THEN 'Customer'
    WHEN EXISTS (SELECT 1 FROM public.providers WHERE id = u.id) THEN 'Provider'
    ELSE 'Sin Rol'
  END as role,
  u.created_at
FROM auth.users u
ORDER BY u.created_at DESC;
```

### Ver autos disponibles:

```sql
SELECT 
  c.id,
  c.make,
  c.model,
  c.year,
  c.priceperday,
  c.status,
  p.companyname as provider
FROM cars c
JOIN providers p ON p.id = c.provider_id
WHERE c.status = 'available'
ORDER BY c.created_at DESC;
```

### Ver reservas activas:

```sql
SELECT 
  b.id,
  u.firstname || ' ' || u.lastname as customer,
  c.make || ' ' || c.model as car,
  p.companyname as provider,
  b.pickupdate,
  b.returndate,
  b.totalprice,
  b.status
FROM bookings b
JOIN users u ON u.id = b.user_id
JOIN cars c ON c.id = b.car_id
JOIN providers p ON p.id = b.provider_id
WHERE b.status IN ('pending', 'approved')
ORDER BY b.pickupdate;
```

### Ver reseñas:

```sql
SELECT 
  r.id,
  u.firstname || ' ' || u.lastname as customer,
  c.make || ' ' || c.model as car,
  r.rating,
  r.comment,
  r.created_at
FROM reviews r
JOIN users u ON u.id = r.user_id
JOIN cars c ON c.id = r.car_id
ORDER BY r.created_at DESC;
```

---

## ✅ Checklist de Testing Completo

### Como CUSTOMER:
- [ ] Registro exitoso
- [ ] Login exitoso
- [ ] Completar perfil
- [ ] Buscar autos
- [ ] Aplicar filtros
- [ ] Ver detalles de auto
- [ ] Crear reserva
- [ ] Ver mis reservas
- [ ] Cancelar reserva
- [ ] Dejar reseña

### Como PROVIDER:
- [ ] Registro exitoso
- [ ] Login exitoso
- [ ] Completar perfil de empresa
- [ ] Publicar auto
- [ ] Editar auto
- [ ] Ver mis autos
- [ ] Recibir reserva
- [ ] Aprobar reserva
- [ ] Rechazar reserva
- [ ] Completar reserva
- [ ] Ver estadísticas

### Validaciones:
- [ ] No permitir reservas conflictivas
- [ ] Validar período mínimo
- [ ] Validar período máximo
- [ ] RLS funciona (no ver datos de otros)
- [ ] Triggers actualizan estados
- [ ] Slugs se generan automáticamente

### Performance:
- [ ] Búsqueda rápida con filtros
- [ ] Carga de imágenes optimizada
- [ ] Paginación funciona
- [ ] Vistas materializadas actualizadas

---

## 🚨 Problemas Comunes y Soluciones

### "Usuario no aparece después de registro"
```sql
-- Verificar si existe en auth pero no en public.users
SELECT * FROM auth.users WHERE email = 'usuario@test.com';
-- Si existe, crear perfil manualmente
INSERT INTO public.users (id, email) 
VALUES ('uuid-del-usuario', 'usuario@test.com');
```

### "No puedo crear reserva"
```sql
-- Verificar disponibilidad del auto
SELECT check_car_availability(car_id, 'fecha-inicio', 'fecha-fin');
-- Verificar que el auto existe y está disponible
SELECT id, status FROM cars WHERE id = car_id;
```

### "RLS bloquea mis queries"
```sql
-- Verificar que estás autenticado
SELECT auth.uid();
-- Debe retornar tu UUID, no NULL
```

---

## 📝 Datos de Prueba Recomendados

### Usuarios:
- **Customer 1:** cliente1@test.com / Test123456!
- **Customer 2:** cliente2@test.com / Test123456!
- **Provider 1:** provider1@test.com / Test123456!
- **Provider 2:** provider2@test.com / Test123456!

### Autos de Prueba:
- Toyota Camry 2024 - Sedan - $45/día
- Honda CR-V 2024 - SUV - $65/día
- Tesla Model 3 2024 - Sedan - $95/día
- Ford F-150 2024 - Pickup - $80/día

---

**¡Listo para probar!** 🚀

Si encuentras algún problema, revisa los logs en:
- Supabase Dashboard → Database → Logs
- Consola del navegador (F12)
- Terminal de tu aplicación
