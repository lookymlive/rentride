# 🇦🇷 RentRide Argentina - Configuración Completa

## 🎉 ¡Sistema Configurado para Argentina!

Todo el sistema ha sido adaptado para Argentina con **Pesos Argentinos ($)** y datos reales del país.

---

## 📊 Estado Actual del Sistema

| Métrica | Valor |
|---------|-------|
| 🌍 País | Argentina 🇦🇷 |
| 💰 Moneda | Pesos Argentinos ($) |
| 📍 Provincias | 24 provincias cargadas |
| 🏢 Proveedores | 3 empresas activas |
| 🚗 Autos Disponibles | 7 vehículos |
| 👤 Customers | 1 (Luis Díaz - Buenos Aires) |
| 📅 Reservas | 1 reserva de prueba |

---

## 🏢 Proveedores Creados

### 1. RentCar Buenos Aires
- **Ubicación:** Av. Corrientes 1234, CABA
- **Contacto:** Carlos Rodríguez
- **Teléfono:** +54 11 4567-8900
- **Email:** contacto@rentcarbsas.com.ar
- **CUIT:** 30-12345678-9
- **Autos:** 3 vehículos

### 2. Córdoba Auto Rent
- **Ubicación:** Av. Colón 567, Córdoba
- **Contacto:** María Fernández
- **Teléfono:** +54 351 456-7890
- **Email:** info@cordobaautorent.com.ar
- **CUIT:** 30-98765432-1
- **Autos:** 2 vehículos

### 3. Mendoza Rent a Car
- **Ubicación:** San Martín 890, Mendoza
- **Contacto:** Juan Pérez
- **Teléfono:** +54 261 789-0123
- **Email:** reservas@mendozarentacar.com.ar
- **CUIT:** 30-11223344-5
- **Autos:** 2 vehículos

---

## 🚗 Catálogo de Autos Disponibles

### Buenos Aires (CABA)

#### 1. Volkswagen Gol Trend 2023
- **Tipo:** Hatchback
- **Transmisión:** Manual
- **Combustible:** Nafta (1.6L)
- **Precio:** **$12,000/día**
- **Capacidad:** 5 pasajeros, 2 valijas
- **Descripción:** Auto compacto perfecto para moverse por la ciudad
- **Proveedor:** RentCar Buenos Aires

#### 2. Toyota Corolla 2024
- **Tipo:** Sedán
- **Transmisión:** Automática
- **Combustible:** Nafta (1.8L)
- **Precio:** **$15,000/día**
- **Capacidad:** 5 pasajeros, 3 valijas
- **Características:** Bluetooth, cámara de retroceso, A/C
- **Proveedor:** RentCar Buenos Aires

#### 3. Ford Ranger 2024
- **Tipo:** Pickup 4x4
- **Transmisión:** Automática
- **Combustible:** Diesel (3.2L)
- **Precio:** **$25,000/día**
- **Mínimo:** 2 días
- **Capacidad:** 5 pasajeros, 4 valijas
- **Descripción:** Ideal para viajes largos y terrenos difíciles
- **Proveedor:** RentCar Buenos Aires

### Córdoba

#### 4. Chevrolet Onix 2024
- **Tipo:** Hatchback
- **Transmisión:** Automática
- **Combustible:** Nafta (1.0L)
- **Precio:** **$13,500/día**
- **Capacidad:** 5 pasajeros, 2 valijas
- **Descripción:** Moderno con excelente rendimiento
- **Proveedor:** Córdoba Auto Rent

#### 5. Fiat Cronos 2023
- **Tipo:** Sedán
- **Transmisión:** Manual
- **Combustible:** Nafta (1.3L)
- **Precio:** **$14,000/día**
- **Capacidad:** 5 pasajeros, 3 valijas
- **Descripción:** Espacioso y cómodo para familias
- **Proveedor:** Córdoba Auto Rent

### Mendoza

#### 6. Peugeot 208 2024
- **Tipo:** Hatchback
- **Transmisión:** Automática
- **Combustible:** Nafta (1.2L)
- **Precio:** **$14,500/día**
- **Capacidad:** 5 pasajeros, 2 valijas
- **Descripción:** Elegante y moderno
- **Proveedor:** Mendoza Rent a Car

#### 7. Renault Duster 2024
- **Tipo:** SUV
- **Transmisión:** Automática
- **Combustible:** Nafta (1.6L)
- **Precio:** **$18,000/día**
- **Mínimo:** 2 días
- **Capacidad:** 5 pasajeros, 4 valijas
- **Descripción:** Robusta, ideal para la Cordillera
- **Proveedor:** Mendoza Rent a Car

---

## 👤 Usuario de Prueba (Customer)

**Datos del usuario actual:**
- **Nombre:** Luis Díaz
- **Email:** luisdtv@gmail.com
- **Teléfono:** +54 11 1234-5678
- **Ubicación:** Buenos Aires, CABA
- **Rol:** Customer ✅

**Reserva activa:**
- **Auto:** Toyota Corolla 2024
- **Recogida:** 20 de Octubre, 2025
- **Devolución:** 23 de Octubre, 2025
- **Días:** 3 días
- **Total:** $45,000
- **Estado:** Pendiente (esperando aprobación)

---

## 🗺️ Provincias de Argentina Disponibles

Las 24 provincias están cargadas en el sistema:

1. Buenos Aires
2. Ciudad Autónoma de Buenos Aires (CABA)
3. Córdoba
4. Santa Fe
5. Mendoza
6. Tucumán
7. Entre Ríos
8. Salta
9. Misiones
10. Chaco
11. Corrientes
12. Santiago del Estero
13. San Juan
14. Jujuy
15. Río Negro
16. Neuquén
17. Formosa
18. Chubut
19. San Luis
20. Catamarca
21. La Rioja
22. La Pampa
23. Santa Cruz
24. Tierra del Fuego

---

## 🧪 Cómo Probar el Sistema

### 1. Buscar Autos en Argentina

```sql
-- Buscar autos disponibles en Argentina
SELECT * FROM search_cars(
  p_country_id := (SELECT id FROM countries WHERE code = 'ARG'),
  p_min_price := 10000,
  p_max_price := 20000,
  p_limit := 10
);
```

### 2. Buscar Autos en Buenos Aires

```sql
SELECT * FROM search_cars(
  p_country_id := (SELECT id FROM countries WHERE code = 'ARG'),
  p_region_id := (SELECT id FROM regions WHERE name = 'Ciudad Autónoma de Buenos Aires'),
  p_limit := 10
);
```

### 3. Ver Todos los Autos con Precios

```sql
SELECT 
  c.make || ' ' || c.model || ' ' || c.year as auto,
  c.type as tipo,
  '$' || c.priceperday as precio_por_dia,
  c.status,
  p.companyname as proveedor,
  r.name as provincia
FROM cars c
JOIN providers p ON p.id = c.provider_id
JOIN regions r ON r.id = c.region_id
WHERE c.country_id = (SELECT id FROM countries WHERE code = 'ARG')
ORDER BY c.priceperday;
```

### 4. Ver Reservas del Usuario

```sql
SELECT 
  b.id,
  c.make || ' ' || c.model as auto,
  b.pickupdate as recogida,
  b.returndate as devolucion,
  '$' || b.totalprice as total,
  b.status as estado,
  p.companyname as proveedor
FROM bookings b
JOIN cars c ON c.id = b.car_id
JOIN providers p ON p.id = b.provider_id
WHERE b.user_id = '00ad418f-d903-439b-bfdb-c31a3c49a672';
```

### 5. Aprobar la Reserva (Como Provider)

```sql
-- Cambiar estado de la reserva
UPDATE bookings
SET status = 'approved'
WHERE id = 1
RETURNING id, status;

-- Verificar que el auto cambió a 'booked'
SELECT id, make, model, status FROM cars WHERE id = 1;
```

### 6. Completar la Reserva

```sql
-- Marcar como completada
UPDATE bookings
SET status = 'completed'
WHERE id = 1;

-- Verificar que el auto volvió a 'available'
SELECT id, make, model, status FROM cars WHERE id = 1;
```

### 7. Crear una Reseña

```sql
-- El customer puede dejar reseña después de completar
INSERT INTO reviews (
  user_id,
  car_id,
  provider_id,
  rating,
  comment
) VALUES (
  '00ad418f-d903-439b-bfdb-c31a3c49a672',
  1,
  (SELECT provider_id FROM cars WHERE id = 1),
  5,
  'Excelente auto! Muy cómodo y el servicio impecable.'
);
```

---

## 📱 Flujo Completo de Prueba

### Escenario: Luis renta un auto en Buenos Aires

```
1. Luis (Customer) busca autos en Buenos Aires
   ↓
2. Encuentra el Toyota Corolla 2024 a $15,000/día
   ↓
3. Selecciona fechas: 20 al 23 de Octubre (3 días)
   ↓
4. Crea reserva por $45,000 (estado: pending)
   ↓
5. RentCar Buenos Aires recibe la solicitud
   ↓
6. Carlos (Provider) revisa y aprueba
   - Reserva: pending → approved
   - Auto: available → booked
   ↓
7. Luis recibe confirmación
   ↓
8. Luis usa el auto del 20 al 23
   ↓
9. Carlos marca como completada
   - Reserva: approved → completed
   - Auto: booked → available
   ↓
10. Luis deja reseña de 5 estrellas
```

---

## 💰 Rangos de Precios (Pesos Argentinos)

| Categoría | Precio/Día | Ejemplos |
|-----------|------------|----------|
| 💚 Económico | $12,000 - $14,000 | Gol Trend, Onix, Cronos |
| 💙 Estándar | $14,500 - $15,000 | Corolla, 208 |
| 💜 Premium | $18,000 - $25,000 | Duster, Ranger |

---

## 🔍 Consultas Útiles

### Ver Estadísticas Generales

```sql
SELECT 
  'Total Proveedores' as metrica,
  COUNT(*)::text as valor
FROM providers
WHERE country_id = (SELECT id FROM countries WHERE code = 'ARG')

UNION ALL

SELECT 
  'Total Autos',
  COUNT(*)::text
FROM cars
WHERE country_id = (SELECT id FROM countries WHERE code = 'ARG')

UNION ALL

SELECT 
  'Autos Disponibles',
  COUNT(*)::text
FROM cars
WHERE country_id = (SELECT id FROM countries WHERE code = 'ARG')
  AND status = 'available'

UNION ALL

SELECT 
  'Precio Promedio',
  '$' || ROUND(AVG(priceperday))::text
FROM cars
WHERE country_id = (SELECT id FROM countries WHERE code = 'ARG');
```

### Ver Autos por Provincia

```sql
SELECT 
  r.name as provincia,
  COUNT(c.id) as cantidad_autos,
  '$' || MIN(c.priceperday) as precio_minimo,
  '$' || MAX(c.priceperday) as precio_maximo
FROM regions r
LEFT JOIN cars c ON c.region_id = r.id
WHERE r.country_id = (SELECT id FROM countries WHERE code = 'ARG')
GROUP BY r.name
HAVING COUNT(c.id) > 0
ORDER BY cantidad_autos DESC;
```

### Ver Proveedores por Ciudad

```sql
SELECT 
  city as ciudad,
  companyname as empresa,
  phone as telefono,
  COUNT(c.id) as autos
FROM providers p
LEFT JOIN cars c ON c.provider_id = p.id
WHERE p.country_id = (SELECT id FROM countries WHERE code = 'ARG')
GROUP BY p.id, city, companyname, phone
ORDER BY city;
```

---

## 🎯 Próximos Pasos

### 1. Configurar la Aplicación Frontend

Actualizar configuración para Argentina:

```typescript
// config/argentina.ts
export const argentinaConfig = {
  country: {
    code: 'ARG',
    name: 'Argentina',
    flag: '🇦🇷'
  },
  currency: {
    code: 'ARS',
    symbol: '$',
    name: 'Peso Argentino'
  },
  map: {
    center: [-34.6037, -58.3816], // Buenos Aires
    zoom: 5
  },
  phone: {
    prefix: '+54',
    format: '+54 XX XXXX-XXXX'
  }
};
```

### 2. Formatear Precios

```typescript
// utils/currency.ts
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount);
};

// Ejemplo: formatPrice(15000) → "$15.000"
```

### 3. Configurar Mapa con Leaflet

```typescript
// components/Map.tsx
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const argentinaCenter: [number, number] = [-34.6037, -58.3816];

<MapContainer 
  center={argentinaCenter} 
  zoom={5}
  style={{ height: '400px' }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {/* Markers para proveedores */}
</MapContainer>
```

### 4. Agregar Más Datos de Prueba

```sql
-- Agregar más autos en otras provincias
-- Agregar más proveedores
-- Crear más reservas de ejemplo
-- Agregar reseñas
```

---

## 📚 Documentación Relacionada

- 📖 **Guía de Roles:** `docs/USER_ROLES_GUIDE.md`
- 🧪 **Guía de Testing:** `docs/TESTING_GUIDE.md`
- 🗄️ **Esquema de DB:** `docs/database-schema.md`
- 🚀 **Setup Supabase:** `docs/SUPABASE_SETUP.md`

---

## ✅ Checklist de Configuración Argentina

- [x] 24 provincias argentinas cargadas
- [x] 3 proveedores en diferentes ciudades
- [x] 7 autos con precios en pesos
- [x] Usuario customer de Argentina
- [x] Reserva de prueba creada
- [x] Coordenadas GPS de ciudades argentinas
- [x] Teléfonos con formato argentino (+54)
- [x] CUIT para proveedores
- [ ] Frontend adaptado para Argentina
- [ ] Mapa centrado en Argentina
- [ ] Formato de moneda argentino
- [ ] Imágenes de autos locales

---

## 🎉 ¡Todo Listo para Argentina!

El sistema está completamente configurado para operar en Argentina con:
- ✅ Pesos Argentinos ($)
- ✅ Provincias argentinas
- ✅ Proveedores locales
- ✅ Autos populares en Argentina
- ✅ Coordenadas GPS reales
- ✅ Formato de teléfono argentino
- ✅ Datos de prueba completos

**¡Ahora puedes probar todo el flujo de la aplicación!** 🚀🇦🇷
