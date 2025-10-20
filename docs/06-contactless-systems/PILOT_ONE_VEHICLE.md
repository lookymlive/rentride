# 🚗 Piloto UN VEHÍCULO - Prueba de Robo y Recuperación

**Objetivo**: Sistema completo en 1 vehículo para probar detección de robo  
**Timeline**: 2-3 semanas  
**Presupuesto**: $400-600

---

## 💰 Presupuesto Total

### Hardware
```
TCU AutoPi TMU CM4: $249
SIM Hologram: $0 (gratis) + $5/mes
Relé inmovilizador: $8
Cableado: $15
Fusibles: $5
Herramientas: $30 (si no tienes)
────────────────────────
TOTAL HARDWARE: $307
```

### Software (Primer Mes)
```
AWS IoT Core: $0 (free tier)
Supabase: $0 (free tier)
Hologram datos: $5
Twilio SMS: $5
────────────────────────
TOTAL SOFTWARE: $10/mes
```

### Instalación
```
Opción 1 - Tú mismo: $0
Opción 2 - Técnico: $100
```

### TOTAL INVERSIÓN
```
DIY: $317
Con técnico: $417
```

---

## 📦 Lista de Compras

### 1. AutoPi TMU CM4 - $249
- **Dónde**: https://shop.autopi.io/
- **Incluye**: TCU, cable OBD-II, antenas GPS/4G
- **Alternativa económica**: Queclink GV500 ($129)

### 2. SIM Hologram - Gratis
- **Dónde**: https://hologram.io/
- **Plan**: Pilot (1 MB gratis, $0.60/MB adicional)
- **Envío**: 7-10 días a Argentina

### 3. Relé 12V 30A - $8
- **Dónde**: MercadoLibre
- **Buscar**: "relé automotriz 12V 30A SPDT"
- **Specs**: 5 pines (85, 86, 87, 87a, 30)

### 4. Materiales - $20
- Cable 16 AWG (5m)
- Conectores quick disconnect (10)
- Cinta aislante
- Bridas (20)
- Fusible 10A (2)

---

## 🔧 Instalación Paso a Paso

### PASO 1: Configurar AutoPi (30 min)

**1.1 Setup Inicial**:
```
1. Crear cuenta en my.autopi.io
2. Registrar dispositivo (serial number)
3. Insertar SIM Hologram
4. Conectar a WiFi
5. Actualizar firmware
```

**1.2 Configurar APN**:
```
Settings > Connectivity > Mobile
APN: hologram
Username: (vacío)
Password: (vacío)
```

### PASO 2: Instalar en Vehículo (2 horas)

**2.1 Conectar OBD-II**:
```
1. Localizar puerto OBD-II (bajo volante)
2. Conectar cable AutoPi
3. Encender vehículo
4. Verificar LED verde en AutoPi
5. Verificar en my.autopi.io:
   ✓ Status: Online
   ✓ GPS: Ubicación correcta
   ✓ OBD: Datos del motor
```

**2.2 Instalar Inmovilizador**:

**⚠️ ADVERTENCIA**: Requiere conocimientos eléctricos. Si no estás seguro, contrata técnico.

**Diagrama Simple**:
```
AutoPi GPIO 5 ──→ Resistor 1kΩ ──→ Relé Pin 85
Relé Pin 86 ──→ GND (masa)
Relé Pin 30 ──→ Cable starter (lado llave)
Relé Pin 87a ──→ Cable starter (lado motor)
```

**Pasos**:
```
1. Desconectar batería (-)
2. Identificar cable del motor de arranque
3. Cortar cable
4. Conectar relé según diagrama
5. Aislar conexiones
6. Reconectar batería
7. TEST: Verificar que arranca normalmente
```

**2.3 Ocultar TCU**:
```
- Ubicación: Bajo tablero o asiento
- Asegurar con velcro o bridas
- Verificar señal GPS (LED azul)
```

### PASO 3: Setup Software (3 horas)

**3.1 AWS IoT Core**:
```
1. Crear cuenta AWS (free tier)
2. IoT Core > Create Thing: "vehicle-001"
3. Descargar certificados
4. Crear Policy (allow all)
5. Copiar endpoint URL
```

**3.2 Supabase**:
```
1. Crear cuenta en supabase.com
2. New Project: "rentia-pilot"
3. Ejecutar SQL:
```

```sql
CREATE TABLE telemetry (
  id BIGSERIAL PRIMARY KEY,
  device_id TEXT,
  timestamp TIMESTAMP,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  rpm INTEGER,
  fuel_level DOUBLE PRECISION
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT,
  event_type TEXT,
  severity TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**3.3 Conectar AutoPi a AWS**:

Script Python en AutoPi (`/home/pi/telemetry.py`):
```python
import time, json
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

# Config
CLIENT_ID = "vehicle-001"
ENDPOINT = "TU-ENDPOINT.iot.us-east-1.amazonaws.com"
TOPIC = "rentia/telemetry"

# Conectar
client = AWSIoTMQTTClient(CLIENT_ID)
client.configureEndpoint(ENDPOINT, 8883)
client.configureCredentials("/etc/autopi/aws/root-ca.pem", 
                           "/etc/autopi/aws/private.key", 
                           "/etc/autopi/aws/certificate.pem.crt")
client.connect()

# Loop
while True:
    gps = __salt__['ec2x.gnss_nmea_gngga']()
    obd = __salt__['obd.query']('rpm', 'speed', 'fuel_level')
    
    payload = {
        "device_id": CLIENT_ID,
        "timestamp": time.time(),
        "lat": gps.get('latitude', 0),
        "lon": gps.get('longitude', 0),
        "speed": obd.get('speed', 0),
        "rpm": obd.get('rpm', 0),
        "fuel_level": obd.get('fuel_level', 0)
    }
    
    client.publish(TOPIC, json.dumps(payload), 1)
    time.sleep(10)
```

**3.4 Lambda para Detección de Robo**:
```python
def lambda_handler(event, context):
    payload = json.loads(event['body'])
    speed = payload['speed']
    
    # Simular: no hay viaje activo
    has_active_trip = False
    
    if not has_active_trip and speed > 5:
        # ROBO DETECTADO!
        alert = {
            'device_id': payload['device_id'],
            'event_type': 'THEFT',
            'severity': 'CRITICAL',
            'lat': payload['lat'],
            'lon': payload['lon']
        }
        
        # Guardar en Supabase
        supabase.table('events').insert(alert).execute()
        
        # Enviar SMS
        send_sms(f"⚠️ ROBO DETECTADO! Vehículo en movimiento. Lat: {payload['lat']}, Lon: {payload['lon']}")
        
    return {'statusCode': 200}
```

---

## 🧪 Tests de Validación

### Test 1: Conectividad (10 min)
```
✓ GPS: Ubicación correcta en my.autopi.io
✓ 4G: Status "Connected"
✓ OBD: RPM, velocidad, combustible
✓ AWS: Mensajes llegan cada 10 seg
✓ Supabase: Datos se guardan en tabla
```

### Test 2: Inmovilizador (15 min)
```
1. Modo normal:
   ✓ Vehículo arranca normalmente

2. Inmovilizar manualmente:
   SSH: python3 /home/pi/immobilizer.py immobilize
   ✓ Vehículo NO arranca

3. Habilitar:
   SSH: python3 /home/pi/immobilizer.py enable
   ✓ Vehículo arranca

4. Inmovilizar remotamente (AWS):
   Publicar a topic: rentia/commands
   {"command": "IMMOBILIZE"}
   ✓ Vehículo NO arranca
```

### Test 3: Simulación de Robo (30 min)

**Escenario**: Mover vehículo sin viaje activo

**Preparación**:
```
1. Abrir AWS IoT Test (suscribirse a rentia/telemetry)
2. Abrir Supabase (tabla events)
3. Tener celular listo
```

**Ejecución**:
```
1. Encender vehículo
2. Conducir 100 metros
3. Observar:
   ✓ Sistema detecta speed > 5 km/h
   ✓ Lambda detecta "no hay viaje activo"
   ✓ Evento "THEFT" se crea en Supabase
   ✓ SMS de alerta llega al celular
   ✓ Tracking se vuelve intensivo
```

**Recuperación**:
```
1. Detener vehículo
2. Enviar comando IMMOBILIZE desde AWS
3. Apagar motor
4. Intentar arrancar
   ✓ Motor NO arranca
5. "Recuperar" vehículo
6. Enviar comando ENABLE
   ✓ Motor arranca
```

---

## 📊 Métricas a Medir

### Durante el Piloto (2-3 semanas)

**Técnicas**:
- Tiempo de detección de robo: < 30 seg
- Precisión GPS: < 5 metros
- Uptime del sistema: > 99%
- Latencia de comandos: < 2 seg
- Consumo de datos: ~30 MB/mes

**Funcionales**:
- Inmovilizador funciona: 100% de las veces
- Falsos positivos: 0
- Alertas recibidas: 100%
- Tiempo de recuperación simulada: < 5 min

**Operacionales**:
- Tiempo de instalación real: X horas
- Dificultades encontradas: (documentar)
- Ajustes necesarios: (documentar)

---

## 📝 Documentar Todo

### Bitácora del Piloto

**Día 1: Compra**
```
- [ ] AutoPi ordenado
- [ ] SIM Hologram solicitado
- [ ] Materiales comprados
- [ ] Costo real: $___
```

**Día 7: Instalación**
```
- [ ] AutoPi recibido
- [ ] Configuración inicial: ___ min
- [ ] Instalación física: ___ horas
- [ ] Dificultades: ___
- [ ] Funciona correctamente: Sí/No
```

**Día 10: Software**
```
- [ ] AWS configurado
- [ ] Supabase configurado
- [ ] Lambda funcionando
- [ ] Datos llegando correctamente
```

**Día 14: Testing**
```
- [ ] Test conectividad: Pass/Fail
- [ ] Test inmovilizador: Pass/Fail
- [ ] Simulación robo: Pass/Fail
- [ ] Tiempo detección: ___ seg
- [ ] Tiempo recuperación: ___ min
```

**Día 21: Conclusiones**
```
- [ ] Sistema funciona: Sí/No
- [ ] Listo para escalar: Sí/No
- [ ] Ajustes necesarios: ___
- [ ] Costo real total: $___
- [ ] ROI estimado: ___
```

---

## ✅ Checklist Completo

### Pre-Instalación
- [ ] Presupuesto aprobado ($400-600)
- [ ] Hardware ordenado
- [ ] Cuentas creadas (AWS, Supabase, Hologram)
- [ ] Vehículo disponible para pruebas
- [ ] Lugar seguro para tests

### Instalación
- [ ] AutoPi configurado
- [ ] OBD-II conectado y funcionando
- [ ] Inmovilizador instalado
- [ ] TCU oculto y asegurado
- [ ] GPS con buena señal

### Software
- [ ] AWS IoT Core configurado
- [ ] Supabase con tablas creadas
- [ ] Lambda function deployada
- [ ] Script telemetría corriendo
- [ ] Comandos remotos funcionan

### Testing
- [ ] Conectividad validada
- [ ] Inmovilizador probado
- [ ] Simulación de robo exitosa
- [ ] Alertas funcionando
- [ ] Recuperación probada

### Documentación
- [ ] Bitácora completa
- [ ] Fotos de instalación
- [ ] Tiempos registrados
- [ ] Problemas documentados
- [ ] Mejoras identificadas

---

## 🚀 Próximos Pasos

### Si el Piloto es Exitoso
```
1. Documentar lecciones aprendidas
2. Ajustar proceso de instalación
3. Preparar rollout a 10 vehículos
4. Calcular costos reales a escala
5. Entrenar equipo técnico
```

### Si Hay Problemas
```
1. Identificar causa raíz
2. Probar soluciones alternativas
3. Consultar con proveedores
4. Ajustar y repetir test
5. Documentar todo
```

---

## 📞 Soporte

### AutoPi
- Docs: https://docs.autopi.io/
- Forum: https://community.autopi.io/
- Email: support@autopi.io

### AWS
- Docs: https://docs.aws.amazon.com/iot/
- Forum: https://forums.aws.amazon.com/

### Hologram
- Docs: https://hologram.io/docs/
- Support: support@hologram.io

---

**Documento**: Piloto 1 Vehículo  
**Versión**: 1.0  
**Actualizado**: Enero 2025  
**Status**: Listo para Ejecutar

**¡Comienza tu piloto hoy! 🚗🔐**
