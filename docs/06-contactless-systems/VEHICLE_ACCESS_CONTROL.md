# 🔓 Control de Acceso Sin Contacto - Vehículos

**Especialización**: Sistemas Keyless Entry  
**Tecnologías**: BLE 5.3, NFC, UWB  
**Actualizado**: Enero 2025

---

## 🎯 Tecnologías de Acceso 2025

### Comparativa de Protocolos

| Tecnología | Rango | Velocidad | Consumo | Seguridad | Costo | Uso Principal |
|------------|-------|-----------|---------|-----------|-------|---------------|
| **BLE 5.3** | 10-100m | 2 Mbps | Muy bajo | Alta | $ | Desbloqueo remoto |
| **NFC** | < 10cm | 424 Kbps | Muy bajo | Muy alta | $ | Autenticación |
| **UWB** | 10-200m | 27 Mbps | Medio | Muy alta | $$$ | Posicionamiento preciso |
| **4G/5G** | Ilimitado | 100+ Mbps | Alto | Alta | $$ | Backup/remoto |

---

## 📱 BLE 5.3 (Bluetooth Low Energy) - RECOMENDADO

### Ventajas
- ✅ Bajo consumo (batería dura años)
- ✅ Rango extendido (hasta 100m en exterior)
- ✅ Compatible con todos los smartphones
- ✅ Económico
- ✅ Funciona sin internet

### Implementación Práctica

**Hardware Necesario**:
- Módulo BLE en TCU (ej: nRF52840)
- Relé de 12V para cerradura
- Antena externa (opcional, mejora rango)

**Flujo de Desbloqueo**:
```
1. App escanea dispositivos BLE cercanos
2. Detecta vehículo por UUID único
3. Establece conexión segura (pairing)
4. Envía comando de desbloqueo encriptado
5. TCU valida comando y activa relé
6. Cerradura se desbloquea
Tiempo total: < 2 segundos
```

**Código Ejemplo (React Native)**:
```typescript
import BleManager from 'react-native-ble-manager';

const unlockVehicle = async (vehicleId: string) => {
  try {
    // Escanear dispositivos BLE
    await BleManager.scan([], 5, true);
    
    // Conectar al vehículo
    await BleManager.connect(vehicleId);
    
    // Leer característica de autenticación
    const auth = await BleManager.read(
      vehicleId,
      SERVICE_UUID,
      AUTH_CHARACTERISTIC
    );
    
    // Enviar comando de desbloqueo
    const unlockCommand = buildUnlockCommand(auth);
    await BleManager.write(
      vehicleId,
      SERVICE_UUID,
      UNLOCK_CHARACTERISTIC,
      unlockCommand
    );
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
```

**Seguridad**:
- Encriptación AES-256
- Rolling codes (código cambia cada vez)
- Timeout de 30 segundos
- Máximo 3 intentos fallidos

---

## 🔐 NFC (Near Field Communication)

### Uso Principal
- Autenticación de conductor
- Backup si BLE falla
- Tarjetas físicas de acceso

### Implementación
```
Usuario acerca tarjeta NFC → Lector en vehículo → Valida → Desbloquea
```

**Hardware**:
- Lector NFC (ej: PN532)
- Tarjetas MIFARE o NTAG
- Costo: ~$10-20 por lector

---

## 📡 UWB (Ultra-Wideband) - PREMIUM

### Ventajas
- Posicionamiento preciso (< 10cm)
- Detección de distancia exacta
- Resistente a ataques relay
- Desbloqueo automático al acercarse

### Uso en Carsharing
```
Usuario camina hacia vehículo
  ↓
UWB detecta distancia < 2m
  ↓
Desbloqueo automático
  ↓
Usuario abre puerta sin tocar app
```

**Costo**: $50-100 más por vehículo

---

## 🛡️ Seguridad Avanzada

### Prevención de Ataques

**1. Relay Attack Prevention**:
```python
def validate_unlock_request(request):
    # Verificar timestamp
    if time.now() - request.timestamp > 5:
        return False  # Muy viejo, posible replay
    
    # Verificar distancia (con UWB o RSSI)
    if request.distance > MAX_UNLOCK_DISTANCE:
        return False  # Muy lejos
    
    # Verificar rolling code
    if not validate_rolling_code(request.code):
        return False  # Código inválido
    
    return True
```

**2. Autenticación Multifactor**:
- Algo que tienes (smartphone)
- Algo que sabes (PIN en app)
- Algo que eres (biometría)

**3. Geofencing**:
```javascript
// Solo permitir desbloqueo si usuario está cerca
if (distance_to_vehicle > 50_meters) {
  throw new Error('Debes estar cerca del vehículo');
}
```

---

## 💡 Mejores Prácticas

### Para RentIA

1. **Primary**: BLE 5.3 (rápido, económico)
2. **Backup**: 4G/5G (si BLE falla)
3. **Futuro**: UWB (cuando sea más económico)

### Configuración Recomendada
```yaml
unlock_methods:
  - type: BLE
    priority: 1
    timeout: 30s
    max_distance: 50m
    
  - type: CELLULAR
    priority: 2
    timeout: 10s
    requires_internet: true
    
  - type: NFC
    priority: 3
    requires_physical_card: true
```

---

## 📊 Costos de Implementación

| Componente | Costo Unitario | Cantidad (50 vehículos) | Total |
|------------|----------------|-------------------------|-------|
| Módulo BLE | $15 | 50 | $750 |
| Relé 12V | $5 | 50 | $250 |
| Instalación | $30 | 50 | $1,500 |
| **Total** | | | **$2,500** |

**Costo por vehículo**: $50

---

## 🚀 Roadmap de Implementación

### Fase 1 (Mes 1-2): BLE Básico
- [ ] Integrar módulo BLE en TCU
- [ ] Desarrollar SDK móvil
- [ ] Testing de rango y confiabilidad

### Fase 2 (Mes 3-4): Seguridad
- [ ] Implementar rolling codes
- [ ] Agregar geofencing
- [ ] Auditoría de seguridad

### Fase 3 (Mes 5-6): Optimización
- [ ] Reducir tiempo de desbloqueo
- [ ] Mejorar UX
- [ ] Monitoreo y analytics

---

**Documento**: Control de Acceso Sin Contacto  
**Owner**: Technical Team  
**Actualizado**: Enero 2025
