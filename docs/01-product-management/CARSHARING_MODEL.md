# 🚗 RentIA - Modelo Carsharing Inteligente

**Versión**: 2.0.0  
**Modelo**: Carsharing con Flota Propia + IA  
**Diferenciador**: Inteligencia Artificial integrada  
**Last Updated**: Enero 2025

---

## 🎯 Resumen Ejecutivo

RentIA es un servicio de **carsharing inteligente con flota propia**, potenciado por inteligencia artificial. Este modelo se enfoca en:

- 🚗 **Flota corporativa propia** (no vehículos de terceros)
- 📱 **100% digital y contactless**
- ⏱️ **Pago por uso real** (minutos, horas, días)
- 📍 **Puntos estratégicos** de retiro/devolución
- 🔓 **Desbloqueo inteligente** desde app móvil
- 🤖 **IA integrada** para optimización y seguridad

---

## 🔄 Flujo de Usuario Completo

### 1️⃣ Registro (One-time, 5-10 minutos)

**Paso 1: Descarga de App**
- Usuario descarga app desde App Store / Google Play
- Primera apertura: onboarding interactivo

**Paso 2: Creación de Cuenta**
- Email + contraseña
- Verificación de email
- Aceptar términos y condiciones

**Paso 3: Verificación de Identidad** ⭐ CRÍTICO
Usuario debe enviar:
1. **Selfie personal** (foto de rostro)
2. **Foto de DNI/Pasaporte** (frente y dorso)
3. **Selfie con DNI** (usuario sosteniendo documento)
4. **Licencia de conducir** (frente y dorso)
   - Debe estar vigente
   - Antigüedad mínima: 1 año

**Paso 4: Método de Pago**
- Tarjeta de crédito (preferido)
- Tarjeta de débito
- Datos guardados de forma segura (PCI compliant)

**Paso 5: Aprobación**
- Verificación manual (24-48 horas)
- Notificación de aprobación
- Usuario puede empezar a usar el servicio

---

### 2️⃣ Búsqueda y Reserva de Vehículo

**Paso 1: Abrir App**
- Mapa interactivo muestra:
  - Ubicación actual del usuario
  - Puntos KEKO con autos disponibles
  - Cantidad de autos por punto
  - Distancia a cada punto

**Paso 2: Seleccionar Vehículo**
- Ver detalles del auto:
  - Modelo, año, color
  - Nivel de combustible
  - Estado de limpieza
  - Fotos del vehículo
  - Tarifa por minuto/hora/día
- Filtros disponibles:
  - Tipo de vehículo (sedan, SUV, etc.)
  - Transmisión (manual/automática)
  - Capacidad de pasajeros

**Paso 3: Reservar**
- Seleccionar duración estimada (opcional)
- Confirmar punto de retiro
- Reserva activa por 15 minutos
- Timer countdown visible

---

### 3️⃣ Retiro del Vehículo

**Paso 1: Llegar al Punto de Retiro**
- Navegación GPS integrada en app
- Indicaciones precisas al estacionamiento
- Número de espacio/zona específica

**Paso 2: Confirmar Llegada**
- Botón "Llegué al parking" en app
- Geolocalización verifica proximidad
- App desbloquea funciones de inspección

**Paso 3: Inspección Pre-Viaje** ⭐ CRÍTICO
App solicita **5 fotos obligatorias**:
1. **Frente del vehículo** (parachoques, luces)
2. **Lateral izquierdo** (puertas, espejos)
3. **Trasera** (parachoques, luces)
4. **Lateral derecho** (puertas, espejos)
5. **Interior** (asientos, tablero)

**Validaciones automáticas**:
- IA detecta daños visibles
- Comparación con fotos anteriores
- Alertas si hay daños nuevos
- Usuario puede reportar daños adicionales

**Paso 4: Verificación de Estado**
Checklist en app:
- [ ] Nivel de combustible (debe ser > 25%)
- [ ] Limpieza interior (aceptable)
- [ ] Luces funcionando
- [ ] Neumáticos en buen estado
- [ ] Sin daños no reportados

**Paso 5: Desbloquear Vehículo** 🔓
- Botón "Desbloquear" en app
- Comando enviado a dispositivo IoT del auto
- Auto se desbloquea (luces parpadean)
- Llaves están dentro del auto (caja segura o keyless)

**Paso 6: Iniciar Viaje**
- Botón "Iniciar Viaje" en app
- Timer comienza a correr
- Cobro por minuto activo
- GPS tracking activado

---

### 4️⃣ Durante el Viaje

**Funciones Activas en App**:
- ⏱️ **Timer en vivo**: Tiempo transcurrido y costo acumulado
- 📍 **GPS**: Navegación integrada
- ⛽ **Nivel de combustible**: Monitoreo en tiempo real
- 🅿️ **Zonas verdes**: Mapa de zonas permitidas para finalizar
- 📞 **Soporte**: Chat/llamada 24/7
- 🚨 **Emergencias**: Botón de pánico

**Reglas Durante el Viaje**:
- ✅ Puedes conducir libremente dentro del área de cobertura
- ✅ Hasta 2 peajes incluidos
- ✅ Combustible incluido (no recargar)
- ❌ No salir del área de cobertura (geofencing)
- ❌ No fumar en el vehículo
- ❌ No transportar mascotas (sin autorización)
- ❌ No subarrendar el vehículo

**Cobro Dinámico**:
- **En movimiento**: Tarifa completa ($15 ARS/min)
- **Detenido** (motor apagado): 50% tarifa ($7.5 ARS/min)
- **Pausar viaje**: Opción para pausar (50% tarifa)

---

### 5️⃣ Finalización del Viaje

**Paso 1: Llegar a Zona Verde** 🟢
- App muestra mapa de "zonas verdes" permitidas
- Zonas verdes = Puntos KEKO autorizados
- Estacionar en espacio designado

**Paso 2: Confirmar Llegada al Parking**
- Botón "Llegué al parking" en app
- Geolocalización verifica que estás en zona verde
- Si no estás en zona verde → Error + penalización

**Paso 3: Inspección Post-Viaje** ⭐ CRÍTICO
App solicita **5 fotos obligatorias** (mismas que pre-viaje):
1. Frente
2. Lateral izquierdo
3. Trasera
4. Lateral derecho
5. Interior

**Validaciones**:
- IA compara fotos pre vs post
- Detecta nuevos daños
- Usuario debe reportar incidentes

**Paso 4: Verificación Final**
Checklist:
- [ ] Vehículo limpio (sin basura)
- [ ] Ventanas cerradas
- [ ] Luces apagadas
- [ ] Combustible > 25% (si no, cargo extra)
- [ ] Sin objetos personales olvidados

**Paso 5: Finalizar Viaje**
- Botón "Finalizar Viaje" en app
- Timer se detiene
- Auto se bloquea automáticamente
- Llaves quedan dentro (caja segura)

**Paso 6: Pago Automático** 💳
- Cálculo final de costo:
  - Tiempo total × tarifa
  - Extras (peajes, combustible bajo, daños)
  - Descuentos (membresía, promociones)
- Cargo automático a tarjeta registrada
- Recibo digital enviado por email
- Factura disponible en app

---

## 📍 Puntos RentIA (Zonas Verdes)

### Tipos de Ubicaciones Estratégicas

**1. Estaciones de Servicio** ⛽
- YPF, Shell, Axion
- Ventajas: Combustible, baños, tiendas
- Horario: 24/7
- Cantidad inicial: 4 puntos

**2. Shopping Centers** 🛍️
- Alto Palermo, Dot, Unicenter
- Ventajas: Estacionamiento seguro, alto tráfico
- Horario: 10am-10pm
- Cantidad inicial: 3 puntos

**3. Aeropuertos** ✈️
- Aeroparque, Ezeiza
- Ventajas: Turistas, viajes de negocio
- Horario: 24/7
- Cantidad inicial: 2 puntos

**4. Estaciones de Tren/Metro** 🚇
- Retiro, Constitución, Palermo
- Ventajas: Intermodalidad, alto tráfico
- Horario: 6am-12am
- Cantidad inicial: 3 puntos

**5. Zonas Corporativas** 🏢
- Puerto Madero, Catalinas
- Ventajas: Profesionales, viajes de negocio
- Horario: 24/7
- Cantidad inicial: 3 puntos

### Criterios de Selección de Puntos
- ✅ Alta densidad poblacional
- ✅ Acceso a transporte público
- ✅ Seguridad 24/7
- ✅ Estacionamiento techado (preferible)
- ✅ Acuerdo comercial con propietario
- ✅ Conectividad (señal celular)

---

## 💰 Estructura de Precios

### Tarifas Base (Argentina - ARS)

| Modalidad | Precio | Equivalente USD | Uso Típico |
|-----------|--------|-----------------|------------|
| **Por Minuto** | $15 ARS | $0.015 USD | Viajes cortos (< 1 hora) |
| **Por Minuto (Detenido)** | $7.5 ARS | $0.0075 USD | Pausas, semáforos |
| **Por Hora** | $600 ARS | $0.60 USD | Mandados, reuniones |
| **Por Día** | $8,000 ARS | $8 USD | Viajes largos, turismo |
| **Por Semana** | $45,000 ARS | $45 USD | Viajes extendidos |

### Incluido en Precio ✅
- Combustible (nafta)
- Hasta 2 peajes por viaje
- Seguro básico (responsabilidad civil)
- Mantenimiento
- Limpieza
- Asistencia 24/7

### Cargos Adicionales ⚠️

| Concepto | Cargo |
|----------|-------|
| **Combustible bajo** (< 25%) | $500 ARS |
| **Peaje adicional** (> 2) | Costo real + $100 ARS |
| **Limpieza extra** (muy sucio) | $1,000 ARS |
| **Fumar en vehículo** | $5,000 ARS |
| **Daños menores** | Según evaluación |
| **Multas de tránsito** | Costo multa + $500 ARS admin |
| **Devolución fuera de zona** | $2,000 ARS + costo traslado |
| **Retraso sin aviso** (> 30 min) | $500 ARS |

---

## 🔒 Seguridad y Verificación

### Verificación de Usuarios

**Nivel 1: Básico** (Automático)
- Email verificado
- Teléfono verificado
- Método de pago válido

**Nivel 2: Identidad** (Manual, 24-48h)
- Foto de rostro (liveness detection)
- DNI/Pasaporte validado
- Selfie con documento
- Verificación contra bases de datos

**Nivel 3: Conductor** (Manual, 24-48h)
- Licencia de conducir vigente
- Antigüedad mínima 1 año
- Sin antecedentes graves
- Verificación con registro nacional

### Seguridad del Vehículo

**Hardware IoT en cada auto**:
- 🔓 Sistema de desbloqueo remoto
- 📍 GPS tracking en tiempo real
- 📹 Cámara interior (opcional, privacidad)
- 🔊 Micrófono para emergencias
- 🚨 Botón de pánico
- ⛽ Sensor de combustible
- 🔋 Monitoreo de batería

**Seguros**:
- **Básico** (incluido): Responsabilidad civil
- **Full** (+$200 ARS/día): Cero deducible, cobertura total
- **Asistencia**: Grúa, cerrajería, auxilio mecánico

---

## 📱 Features de la App

### Para Usuarios

**Home Screen**:
- Mapa interactivo con autos disponibles
- Búsqueda por ubicación
- Filtros (tipo, precio, distancia)
- Reserva rápida

**Durante Viaje**:
- Timer en vivo
- Costo acumulado
- GPS navegación
- Nivel de combustible
- Zonas verdes (mapa)
- Soporte chat

**Perfil**:
- Historial de viajes
- Métodos de pago
- Documentos
- Membresía
- Referidos
- Configuración

**Extras**:
- Gamification (badges, niveles)
- Programa de referidos
- Descuentos y promociones
- Notificaciones push

### Para Operaciones (Admin)

**Dashboard**:
- Flota en tiempo real
- Utilización por vehículo
- Revenue diario/mensual
- Alertas y incidentes

**Gestión de Flota**:
- Estado de cada vehículo
- Mantenimiento programado
- Limpieza pendiente
- Reubicación de autos

**Usuarios**:
- Verificaciones pendientes
- Reportes de incidentes
- Soporte tickets
- Análisis de comportamiento

---

## 🚀 Roadmap de Implementación

### Fase 1: MVP (Q1 2025)
- [ ] App móvil iOS/Android
- [ ] Sistema de registro y verificación
- [ ] Integración con hardware IoT
- [ ] 10 puntos de retiro
- [ ] 50 vehículos
- [ ] Pagos con Stripe
- [ ] Soporte básico

### Fase 2: Optimización (Q2 2025)
- [ ] IA para detección de daños
- [ ] Pricing dinámico
- [ ] Programa de membresías
- [ ] 25 puntos de retiro
- [ ] 150 vehículos
- [ ] Analytics avanzado

### Fase 3: Escala (Q3 2025)
- [ ] Expansión a 3 ciudades
- [ ] 300 vehículos
- [ ] Flotas corporativas
- [ ] Gamification completo
- [ ] Integración con transporte público

### Fase 4: Innovación (Q4 2025)
- [ ] Vehículos eléctricos
- [ ] Conducción autónoma (futuro)
- [ ] API para partners
- [ ] Expansión internacional

---

## 📊 Métricas Clave (KPIs)

### Operacionales
- **Utilización de flota**: > 60% (objetivo 75%)
- **Tiempo promedio de viaje**: 45 minutos
- **Viajes por vehículo/día**: 4-6
- **Tasa de incidentes**: < 5%
- **Tiempo de limpieza**: < 2 horas

### Financieras
- **Revenue por vehículo/mes**: $1,200 USD
- **Costo por vehículo/mes**: $786 USD
- **Margen neto**: 22%
- **CAC (Customer Acquisition Cost)**: < $30
- **LTV (Lifetime Value)**: > $300

### Usuario
- **Tiempo de registro**: < 5 minutos
- **Tiempo de desbloqueo**: < 30 segundos
- **App rating**: > 4.5 estrellas
- **NPS**: > 50
- **Tasa de retención**: > 40%

---

## 🎯 Ventajas Competitivas vs Alquiler Tradicional

| Aspecto | RentIA Carsharing | Alquiler Tradicional |
|---------|---------------------|----------------------|
| **Precio** | $8/día | $30-50/día |
| **Tiempo de retiro** | < 5 min | 30-60 min |
| **Papeleos** | 0 (100% digital) | Muchos formularios |
| **Flexibilidad** | Por minutos | Por días |
| **Ubicaciones** | 10+ puntos | 1-2 oficinas |
| **Horario** | 24/7 | 9am-6pm |
| **Combustible** | Incluido | No incluido |
| **Seguro** | Incluido | Extra |
| **Contacto** | Cero | Presencial |

---

**Document Owner**: Product Management  
**Last Updated**: Enero 2025  
**Next Review**: Febrero 2025  
**Status**: Living Document 🌱
