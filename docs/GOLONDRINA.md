# Golondrina y asistentes por módulo (panel del proveedor)

Propuesta de [tecnoros.ar](https://www.tecnoros.ar) para RentIA: que el panel del proveedor trabaje solo
en lo repetitivo y que el proveedor solo tenga que aprobar.

## Qué hace

**1. "Buen día" al entrar al panel** (una vez por día):
Golondrina revisa la flota y arma lo que hay que hacer hoy, en dos grupos:

| Grupo | Qué hay | Qué puede hacer el proveedor |
|---|---|---|
| Listo para que lo apruebes | Reservas pendientes, reservas que ya terminaron y siguen "aprobadas", fichas de autos sin fotos o descripción | Aprobar con un toque, o "Ver" para ir a la pantalla |
| Para vos | Retiros y devoluciones de hoy, autos en mantenimiento, reseñas de 1 o 2 estrellas de la semana | "Ver" |

La **G** del encabezado muestra cuántas cosas hay y vuelve a abrir el "Buen día".

**2. Un asistente en cada pantalla del panel** (botón "Asistente", abajo a la derecha):
cambia según dónde estás (panel, autos y reservas, reseñas, cuenta) y responde con los datos de esa parte:
qué tengo que hacer hoy, cuánto facturé este mes, qué autos están libres, qué fichas están incompletas, cómo vienen las reseñas…

## Qué hace sola y qué no

Cada tarea tiene un nivel (`NIVELES` en `src/features/golondrina/reglas.ts`):

- `sola`: la hace sola y avisa, con deshacer. **Solo para cosas reversibles.** Hoy ninguna tarea está en este nivel.
- `ok`: la deja lista y el proveedor la aprueba (aprobar reservas, completar reservas terminadas).
- `nunca`: solo avisa (reseñas bajas, autos en taller, retiros y devoluciones).

Nunca aprueba ni rechaza una reserva, ni responde a un cliente, ni cambia precios, sin que el proveedor lo apruebe.

## Cómo está hecho

```
src/features/golondrina/
  reglas.ts       Funciones puras: revisarFlota() arma las tareas; responder() contesta al asistente.
  Golondrina.tsx  GolondrinaProvider (lee los datos y muestra el "Buen día"),
                  BotonGolondrina (la G del encabezado) y AsistenteModulo (el asistente flotante).
```

- Se monta en `src/features/providers/DashboardLayout.tsx`, así aparece en todas las pantallas del proveedor.
- Lee `cars`, `bookings` (con `users` y `cars`) y `reviews` del proveedor con el cliente de Supabase que ya usa la app.
  Las políticas RLS existentes siguen valiendo: cada proveedor solo ve lo suyo.
- "Aprobar" hace lo mismo que la tabla de reservas: reserva → `approved` y auto → `booked`.
  "Completar" pasa la reserva a `completed` y el auto a `available`.
- No agrega dependencias ni tablas nuevas.

## Próximos pasos

1. **IA en el asistente**: reemplazar `responder()` por una ruta del servidor (`/api/asistente`) que llame a un modelo
   con herramientas por módulo (leer reservas, aprobar con confirmación, etc.). La clave del modelo va solo en el servidor.
2. **Historial**: tabla `golondrina_historial` con quién hizo qué (Golondrina, asistente o persona) y minutos ahorrados.
3. **Ajustes de nivel por proveedor**: que cada proveedor elija qué tareas reversibles puede hacer sola.
4. **Aprender rutinas**: por ejemplo, si todos los lunes el proveedor revisa autos en taller, mostrarlo primero ese día.
