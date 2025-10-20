# 🚫 Inmovilizador Remoto de Vehículos

**Especialización**: Sistemas Antirrobo IoT  
**Aplicación**: Carsharing, Flotas, Seguridad  
**Actualizado**: Enero 2025

---

## 🎯 ¿Qué es un Inmovilizador Remoto?

Sistema que permite **detener el motor** de un vehículo de forma remota mediante comando desde app o plataforma web.

### Casos de Uso

1. **Robo de vehículo** → Inmovilizar inmediatamente
2. **Fin de período de alquiler** → Impedir uso no autorizado
3. **Falta de pago** → Bloquear hasta regularización
4. **Zona prohibida** → Detener si sale de geofence
5. **Emergencia** → Detener vehículo en situación peligrosa

---

## ⚙️ Cómo Funciona

### Arquitectura del Sistema

```
┌─────────────┐
│   App/Web   │ Usuario/Operador solicita inmovilización
└──────┬──────┘
       │ HTTPS
┌──────▼──────┐
│   Backend   │ Valida y envía comando
└──────┬──────┘
       │ MQTT/4G
┌──────▼──────┐
│     TCU     │ Recibe comando, activa salida digital
└──────┬──────┘
       │ 12V Signal
┌──────▼──────┐
│    Relé     │ Corta circuito de arranque
└──────┬──────┘
       │
┌──────▼──────┐
│   Motor     │ NO puede arrancar
└─────────────┘
```

### Métodos de Inmovilización

#### 1. **Corte de Arranque** (Más Común)
- Interrumpe señal del motor de arranque
- Vehículo NO arranca
- **Ventaja**: Seguro, no afecta vehículo en movimiento
- **Desventaja**: Solo funciona cuando está apagado

#### 2. **Corte de Combustible**
- Cierra válvula de combustible
- Motor se detiene gradualmente
- **Ventaja**: Detiene vehículo en movimiento
- **Desventaja**: Peligroso si está en alta velocidad

#### 3. **Corte de Ignición**
- Interrumpe sistema de encendido
- Motor se apaga inmediatamente
- **Ventaja**: Efectivo
- **Desventaja**: MUY peligroso en movimiento

### ⚠️ Seguridad Crítica

**NUNCA inmovilizar vehículo en movimiento** a menos que:
- Velocidad < 5 km/h
- En zona segura (no autopista)
- Emergencia extrema

```python
def immobilize_vehicle(vehicle_id, reason):
    vehicle = get_vehicle_status(vehicle_id)
    
    # VALIDACIONES DE SEGURIDAD
    if vehicle.speed > 5:  # km/h
        return {
            'success': False,
            'error': 'UNSAFE_SPEED',
            'message': 'No se puede inmovilizar en movimiento'
        }
    
    if vehicle.location in HIGHWAYS:
        return {
            'success': False,
            'error': 'UNSAFE_LOCATION',
            'message': 'Ubicación peligrosa para inmovilizar'
        }
    
    # Enviar comando
    send_immobilize_command(vehicle_id)
    
    # Log de auditoría
    log_immobilization({
        'vehicle_id': vehicle_id,
        'timestamp': now(),
        'reason': reason,
        'operator': current_user(),
        'location': vehicle.location
    })
    
    return {'success': True}
```

---

## 🔧 Implementación Hardware

### Componentes Necesarios

**1. TCU con Salida Digital**
- Salida switched ground (12V)
- Capacidad: 1-5A
- Protección contra cortocircuito

**2. Relé Automotriz**
- Voltaje: 12V DC
- Corriente: 30-40A
- Tipo: SPDT (Single Pole Double Throw)
- Costo: $5-10

**3. Cableado**
- Cable calibre 14-16 AWG
- Conectores automotrices
- Fusible de protección

### Diagrama de Conexión

```
TCU Digital Output (Pin 5)
    │
    ├─── Resistor 1kΩ
    │
    └─── Base de Transistor (2N2222)
              │
              ├─── Colector → Relé Coil (+)
              │
              └─── Emisor → GND

Relé Coil (-) → GND

Relé Contactos:
  COM → Motor de Arranque (Señal)
  NO  → Starter Solenoid
  NC  → (No conectado)
```

### Instalación Paso a Paso

1. **Identificar cable de arranque**
   - Usar multímetro
   - Verificar 12V al girar llave

2. **Instalar relé**
   - Cortar cable de arranque
   - Conectar a través del relé
   - COM y NO en serie

3. **Conectar TCU**
   - Salida digital a base de transistor
   - Transistor controla relé

4. **Testing**
   - Modo normal: Vehículo arranca
   - Modo inmovilizado: NO arranca
   - Verificar seguridad

---

## 📱 Control desde App

### API Endpoint

```javascript
POST /api/v1/vehicles/:id/immobilize

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "reason": "THEFT_REPORTED",
  "operator_id": "OP-12345",
  "notes": "Vehículo reportado robado por usuario"
}

Response:
{
  "success": true,
  "immobilized_at": "2025-01-19T15:30:00Z",
  "vehicle_status": "IMMOBILIZED",
  "can_restart": false
}
```

### UI en App de Operaciones

```typescript
const ImmobilizeButton = ({ vehicleId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleImmobilize = async () => {
    const vehicle = await getVehicleStatus(vehicleId);
    
    // Validar seguridad
    if (vehicle.speed > 5) {
      alert('⚠️ Vehículo en movimiento. Espera a que se detenga.');
      return;
    }
    
    // Confirmar acción
    if (!confirm('¿Seguro que deseas inmovilizar este vehículo?')) {
      return;
    }
    
    // Ejecutar
    const result = await immobilizeVehicle(vehicleId, {
      reason: 'OPERATOR_ACTION',
      notes: 'Inmovilizado desde panel de operaciones'
    });
    
    if (result.success) {
      toast.success('✅ Vehículo inmovilizado correctamente');
    }
  };
  
  return (
    <Button 
      color="red" 
      onClick={handleImmobilize}
      disabled={vehicle.speed > 5}
    >
      🚫 Inmovilizar Vehículo
    </Button>
  );
};
```

---

## 🚨 Casos de Uso Reales

### 1. Robo de Vehículo

**Escenario**: Usuario reporta vehículo robado

**Acción**:
```
1. Usuario llama a soporte
2. Operador verifica identidad
3. Confirma robo en sistema
4. Activa GPS tracking intensivo (cada 10 seg)
5. Espera a que vehículo se detenga
6. Inmoviliza remotamente
7. Notifica a policía con ubicación exacta
8. Recuperación en < 24 horas
```

**Resultado**: 90% de recuperación exitosa

### 2. Fin de Alquiler No Autorizado

**Escenario**: Usuario no devuelve vehículo a tiempo

**Acción**:
```
1. Sistema detecta fin de período
2. Envía notificación al usuario (3x)
3. Si no responde en 2 horas:
   - Espera a que vehículo se detenga
   - Inmoviliza automáticamente
4. Usuario debe contactar soporte
5. Paga penalización
6. Sistema desbloquea
```

### 3. Zona Prohibida (Geofencing)

**Escenario**: Vehículo sale de área permitida

**Acción**:
```python
def on_location_update(vehicle_id, location):
    if not is_in_allowed_zone(location):
        # Alertar usuario
        send_notification(vehicle_id, {
            'type': 'WARNING',
            'message': 'Estás fuera de la zona permitida. Regresa en 10 minutos o el vehículo se inmovilizará.'
        })
        
        # Esperar 10 minutos
        schedule_task(delay=600, task=lambda: {
            vehicle = get_vehicle(vehicle_id)
            if not is_in_allowed_zone(vehicle.location):
                if vehicle.speed < 5:
                    immobilize_vehicle(vehicle_id, 'GEOFENCE_VIOLATION')
        })
```

---

## 📊 Estadísticas de Efectividad

| Métrica | Sin Inmovilizador | Con Inmovilizador | Mejora |
|---------|-------------------|-------------------|--------|
| **Vehículos robados recuperados** | 30% | 95% | +217% |
| **Tiempo de recuperación** | 7-30 días | < 24 horas | -96% |
| **Uso no autorizado** | 15% | 2% | -87% |
| **Pérdida por robo** | $50K/año | $5K/año | -90% |

---

## 💰 Costos

### Por Vehículo
```
Relé: $8
Cableado: $5
Instalación: $40
Total: $53
```

### Flota de 50 Vehículos
```
Hardware: $650
Instalación: $2,000
Total: $2,650
```

**ROI**: 3-6 meses (ahorro en robos)

---

## ⚖️ Consideraciones Legales

### Argentina
- Requiere consentimiento del usuario
- Debe estar en contrato de alquiler
- No usar en situaciones peligrosas
- Registro de todas las inmovilizaciones

### España
- Cumplir con RGPD
- Informar al usuario en contrato
- Justificación documentada
- Derecho a apelación

### Mejores Prácticas
1. **Transparencia**: Usuario sabe que existe
2. **Consentimiento**: Acepta en términos
3. **Seguridad**: Solo cuando es seguro
4. **Auditoría**: Log de todas las acciones
5. **Reversible**: Puede desactivarse rápido

---

## 🔐 Seguridad del Sistema

### Prevención de Hacking

```python
def validate_immobilize_command(command):
    # 1. Verificar autenticación
    if not verify_jwt_token(command.token):
        raise Unauthorized()
    
    # 2. Verificar permisos
    if not user_has_permission(command.user, 'IMMOBILIZE'):
        raise Forbidden()
    
    # 3. Verificar firma digital
    if not verify_signature(command):
        raise InvalidSignature()
    
    # 4. Verificar timestamp (prevenir replay)
    if abs(now() - command.timestamp) > 60:
        raise CommandExpired()
    
    # 5. Rate limiting
    if get_immobilize_count(command.user, last_hour) > 5:
        raise RateLimitExceeded()
    
    return True
```

### Encriptación
- Comando encriptado AES-256
- Firma digital RSA-2048
- TLS 1.3 en tránsito

---

## 🚀 Implementación en RentIA

### Fase 1: Básico (Mes 1-2)
- [ ] Instalar relés en 10 vehículos piloto
- [ ] Desarrollar API de inmovilización
- [ ] Testing exhaustivo de seguridad

### Fase 2: Producción (Mes 3-4)
- [ ] Rollout a toda la flota
- [ ] Integrar con app de operaciones
- [ ] Capacitar equipo de soporte

### Fase 3: Automatización (Mes 5-6)
- [ ] Inmovilización automática por geofencing
- [ ] IA para detectar patrones sospechosos
- [ ] Integración con policía

---

**Documento**: Inmovilizador Remoto  
**Owner**: Security & Operations Team  
**Actualizado**: Enero 2025  
**Criticidad**: ALTA - Sistema de Seguridad
