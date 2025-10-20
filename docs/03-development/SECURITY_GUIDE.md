# Guía de Seguridad - RentRide

## 🔐 Tabla de Contenidos

- [Autenticación](#autenticación)
- [Autorización](#autorización)
- [Validación de Datos](#validación-de-datos)
- [Protección de Datos Sensibles](#protección-de-datos-sensibles)
- [Seguridad de API](#seguridad-de-api)
- [Mejores Prácticas](#mejores-prácticas)
- [Checklist de Seguridad](#checklist-de-seguridad)

---

## 🔑 Autenticación

### Implementación Correcta con Supabase

#### ❌ INCORRECTO

```typescript
// NO USAR: getSession() solo lee cookies sin validar
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  // ⚠️ Esta sesión puede ser falsificada
  return session.user;
}
```

**Problema**: `getSession()` lee directamente de las cookies sin validar el token contra el servidor de Supabase Auth. Un atacante podría manipular las cookies.

#### ✅ CORRECTO

```typescript
// USAR: getUser() valida el token con el servidor
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  redirect('/login');
}
// ✅ Usuario autenticado y verificado
return user;
```

**Beneficio**: `getUser()` hace una llamada al servidor de Supabase Auth para validar el token, garantizando autenticidad.

### Middleware de Autenticación

```typescript
// src/middleware.ts
export async function middleware(req: NextRequest) {
  const supabase = createServerClient(/* ... */);
  
  // Refrescar sesión si está expirada
  await supabase.auth.getUser();
  
  return response;
}
```

### Protección de Rutas

```typescript
// Server Component
export default async function ProtectedPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Usuario autenticado
  return <Dashboard user={session.user} />;
}
```

### Manejo de Tokens

```typescript
// ✅ Tokens en cookies HTTP-only (automático con Supabase SSR)
// ❌ NUNCA almacenar tokens en localStorage o sessionStorage
// ❌ NUNCA exponer tokens en el cliente

// Configuración segura de cookies
const supabase = createServerClient(url, key, {
  cookies: {
    getAll() { return cookieStore.getAll(); },
    setAll(cookies) {
      cookies.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, {
          ...options,
          httpOnly: true,    // ✅ No accesible desde JavaScript
          secure: true,      // ✅ Solo HTTPS
          sameSite: 'lax',   // ✅ Protección CSRF
        });
      });
    },
  },
});
```

---

## 🛡️ Autorización

### Row Level Security (RLS)

Supabase permite definir políticas de seguridad a nivel de fila en PostgreSQL.

#### Ejemplo: Usuarios solo ven sus propias reservas

```sql
-- Habilitar RLS en la tabla
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Política de lectura
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

-- Política de inserción
CREATE POLICY "Users can create own bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política de actualización
CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
USING (auth.uid() = user_id);
```

#### Ejemplo: Proveedores gestionan sus vehículos

```sql
-- Política para proveedores
CREATE POLICY "Providers manage own cars"
ON cars FOR ALL
USING (auth.uid() = provider_id);

-- Política de lectura pública
CREATE POLICY "Anyone can view available cars"
ON cars FOR SELECT
USING (status = 'available');
```

### Verificación de Roles

```typescript
// Verificar rol en Server Action
export async function deletecar(carId: string) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new AppError('Unauthorized', ErrorType.AUTH, 401);
  }
  
  // Verificar que el usuario es proveedor
  const isProvider = user.user_metadata?.role === 'provider';
  if (!isProvider) {
    throw new AppError(
      'Only providers can delete cars',
      ErrorType.AUTHORIZATION,
      403
    );
  }
  
  // Verificar que el carro pertenece al proveedor
  const car = await getCar(carId);
  if (car.provider_id !== user.id) {
    throw new AppError(
      'You can only delete your own cars',
      ErrorType.AUTHORIZATION,
      403
    );
  }
  
  // Proceder con eliminación
  return await deleteCar(carId);
}
```

---

## ✅ Validación de Datos

### Principio: Nunca Confiar en el Cliente

**Siempre validar en el servidor**, incluso si hay validación en el cliente.

### Validación de Entrada

```typescript
import { validateUserData, sanitizeString } from '@/lib/validators';

export async function updateProfile(data: ProfileData) {
  // 1. Validar estructura
  validateUserData(data);
  
  // 2. Sanitizar entrada
  const sanitized = {
    firstName: sanitizeString(data.firstName),
    lastName: sanitizeString(data.lastName),
    email: data.email.toLowerCase().trim(),
  };
  
  // 3. Validaciones de negocio
  if (sanitized.firstName.length < 2) {
    throw new AppError('First name too short', ErrorType.VALIDATION, 400);
  }
  
  // 4. Procesar
  return await updateUser(sanitized);
}
```

### Validadores Comunes

```typescript
// Email
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new AppError('Invalid email', ErrorType.VALIDATION, 400);
  }
  return true;
};

// UUID
export const validateUUID = (id: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!regex.test(id)) {
    throw new AppError('Invalid ID format', ErrorType.VALIDATION, 400);
  }
  return true;
};

// Rango numérico
export const validateRange = (
  value: number,
  min: number,
  max: number,
  field: string
): boolean => {
  if (value < min || value > max) {
    throw new AppError(
      `${field} must be between ${min} and ${max}`,
      ErrorType.VALIDATION,
      400
    );
  }
  return true;
};
```

### Sanitización

```typescript
// Remover caracteres peligrosos
export const sanitizeString = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '')           // Remover < y >
    .replace(/javascript:/gi, '')   // Remover javascript:
    .replace(/on\w+=/gi, '');       // Remover event handlers
};

// Sanitizar HTML (si es necesario permitir HTML)
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
};
```

---

## 🔒 Protección de Datos Sensibles

### Variables de Entorno

```bash
# .env.local (NUNCA commitear)

# ✅ Públicas (prefijo NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx

# ✅ Privadas (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # ⚠️ NUNCA exponer
CLOUDINARY_API_SECRET=xxx            # ⚠️ NUNCA exponer
DATABASE_URL=postgresql://xxx        # ⚠️ NUNCA exponer
```

### Uso Correcto

```typescript
// ✅ En Server Component o Server Action
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Solo disponible en servidor
);

// ❌ NUNCA en Client Component
// process.env.SUPABASE_SERVICE_ROLE_KEY será undefined en el cliente
```

### Encriptación de Datos Sensibles

```typescript
import crypto from 'crypto';

// Encriptar datos sensibles antes de almacenar
export const encrypt = (text: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

// Desencriptar al leer
export const decrypt = (text: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

---

## 🌐 Seguridad de API

### Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests por 10 segundos
});

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

### CORS

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### Headers de Seguridad

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Prevenir clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevenir MIME sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Protección XSS
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

---

## 📋 Mejores Prácticas

### 1. Principio de Mínimo Privilegio

```typescript
// ❌ Usar service role key para todo
const supabase = createClient(url, SERVICE_ROLE_KEY);

// ✅ Usar anon key con RLS
const supabase = createClient(url, ANON_KEY);
// RLS se encarga de los permisos
```

### 2. Nunca Exponer Información Sensible

```typescript
// ❌ Exponer detalles de error
catch (error) {
  return { error: error.message, stack: error.stack };
}

// ✅ Mensaje genérico al cliente, log detallado en servidor
catch (error) {
  logError(error); // Log completo en servidor
  return { error: 'An error occurred' }; // Mensaje genérico al cliente
}
```

### 3. Validar Siempre en el Servidor

```typescript
// ❌ Solo validación en cliente
<form onSubmit={handleSubmit}>
  <input required minLength={3} />
</form>

// ✅ Validación en cliente Y servidor
// Cliente:
<form onSubmit={handleSubmit}>
  <input required minLength={3} />
</form>

// Servidor:
export async function createUser(data: UserData) {
  validateUserData(data); // ✅ Validación obligatoria
  // ...
}
```

### 4. Usar HTTPS en Producción

```typescript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://yourdomain.com/:path*',
        permanent: true,
      },
    ];
  },
};
```

### 5. Auditoría y Logging

```typescript
// Registrar acciones críticas
export async function deleteUser(userId: string) {
  const admin = await getAuthenticatedUser();
  
  // Log de auditoría
  await auditLog({
    action: 'DELETE_USER',
    performedBy: admin.id,
    targetUser: userId,
    timestamp: new Date(),
    ip: req.ip,
  });
  
  return await deleteUserFromDB(userId);
}
```

---

## ✅ Checklist de Seguridad

### Autenticación
- [ ] Usar `getUser()` en lugar de `getSession()`
- [ ] Implementar middleware de autenticación
- [ ] Proteger todas las rutas sensibles
- [ ] Tokens en cookies HTTP-only
- [ ] Implementar refresh de tokens

### Autorización
- [ ] Habilitar RLS en todas las tablas
- [ ] Crear políticas para cada rol
- [ ] Verificar permisos en Server Actions
- [ ] Validar propiedad de recursos

### Validación
- [ ] Validar todos los inputs en el servidor
- [ ] Sanitizar datos de entrada
- [ ] Validar tipos de datos
- [ ] Validar rangos y formatos

### Datos Sensibles
- [ ] Variables de entorno configuradas
- [ ] Secrets no commiteados
- [ ] Encriptar datos sensibles
- [ ] No exponer información en errores

### API
- [ ] Implementar rate limiting
- [ ] Configurar CORS correctamente
- [ ] Headers de seguridad configurados
- [ ] Validar Content-Type

### Infraestructura
- [ ] HTTPS en producción
- [ ] Backups automáticos
- [ ] Monitoreo de seguridad
- [ ] Logs de auditoría

---

## 🚨 Respuesta a Incidentes

### Detección

1. Monitorear logs de error
2. Alertas de intentos de acceso no autorizado
3. Revisar métricas de tráfico anormal

### Respuesta

1. **Identificar**: ¿Qué está comprometido?
2. **Contener**: Revocar tokens, bloquear IPs
3. **Erradicar**: Parchear vulnerabilidad
4. **Recuperar**: Restaurar desde backup si es necesario
5. **Documentar**: Crear post-mortem

### Contactos de Emergencia

- **Supabase Support**: support@supabase.io
- **Cloudinary Support**: support@cloudinary.com
- **Equipo de Desarrollo**: [email]

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

**Última actualización**: 2025-01-19  
**Versión**: 1.0.0  
**Mantenedor**: Equipo de Seguridad RentRide
