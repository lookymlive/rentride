// Golondrina: revisa la flota del proveedor y arma lo que hay que hacer hoy.
// Funciones puras (sin Supabase ni React) para poder probarlas y reutilizarlas.
//
// Tres niveles por tarea (ver NIVELES):
//   'sola'  → la hace sola y avisa, con deshacer. Solo para cosas reversibles.
//   'ok'    → la deja lista y la persona la aprueba con un toque.
//   'nunca' → nunca la hace sola; solo avisa (reclamos, precios, pagos, borrar).

export type Nivel = 'sola' | 'ok' | 'nunca';

export interface AutoFlota {
  id: number;
  make: string;
  model: string;
  slug?: string;
  status: string; // available | pending | booked | maintenance | inactive
  images?: string[] | null;
  description?: string | null;
}

export interface ReservaFlota {
  id: number;
  car_id: number;
  status: string; // pending | approved | rejected | completed | cancelled
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  created_at?: string;
  users?: { firstName?: string; lastName?: string } | null;
  cars?: { make?: string; model?: string } | null;
}

export interface ResenaFlota {
  id: number;
  rating: number;
  comment?: string | null;
  created_at: string;
  car_id?: number;
}

export interface DatosFlota {
  autos: AutoFlota[];
  reservas: ReservaFlota[];
  resenas: ResenaFlota[];
}

export type TipoTarea =
  | 'aprobar_reservas'
  | 'completar_reservas'
  | 'completar_fichas'
  | 'retiros_hoy'
  | 'devoluciones_hoy'
  | 'autos_en_taller'
  | 'resenas_bajas';

/** Qué puede hacer Golondrina con cada tarea. Se puede cambiar por proveedor más adelante. */
export const NIVELES: Record<TipoTarea, Nivel> = {
  aprobar_reservas: 'ok', // afecta al cliente: siempre con OK
  completar_reservas: 'ok', // reversible, pero cambia el estado del auto: por ahora con OK
  completar_fichas: 'ok', // lleva a completar la ficha; no inventa datos
  retiros_hoy: 'nunca', // solo aviso
  devoluciones_hoy: 'nunca', // solo aviso
  autos_en_taller: 'nunca', // solo aviso
  resenas_bajas: 'nunca', // las responde una persona
};

export interface Tarea {
  tipo: TipoTarea;
  nivel: Nivel;
  titulo: string;
  detalle: string;
  /** ids afectados (reservas o autos) */
  ids: number[];
  /** a qué parte del panel lleva "Ver" */
  ver: 'dashboard' | 'cars' | 'reviews';
  /** minutos que se estima que ahorra si se aprueba */
  minutos: number;
}

const nombreAuto = (a?: { make?: string; model?: string } | null) => [a?.make, a?.model].filter(Boolean).join(' ') || 'Auto';
const nombreCliente = (r: ReservaFlota) => [r.users?.firstName, r.users?.lastName].filter(Boolean).join(' ') || 'Cliente';

/** AAAA-MM-DD en hora local (las fechas de reserva son días, no horarios). */
export const diaLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dia = (s: string) => (s || '').slice(0, 10);

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

export function revisarFlota(d: DatosFlota, ahora = new Date()): Tarea[] {
  const hoy = diaLocal(ahora);
  const tareas: Tarea[] = [];

  const pendientes = d.reservas.filter((r) => r.status === 'pending');
  if (pendientes.length) {
    tareas.push({
      tipo: 'aprobar_reservas',
      nivel: NIVELES.aprobar_reservas,
      titulo: `${plural(pendientes.length, 'reserva espera', 'reservas esperan')} tu aprobación`,
      detalle: pendientes.map((r) => `${nombreCliente(r)} · ${nombreAuto(r.cars)} · ${dia(r.pickupDate)} → ${dia(r.returnDate)}`).join('\n'),
      ids: pendientes.map((r) => r.id),
      ver: 'cars',
      minutos: 2 * pendientes.length,
    });
  }

  const retiros = d.reservas.filter((r) => r.status === 'approved' && dia(r.pickupDate) === hoy);
  if (retiros.length) {
    tareas.push({
      tipo: 'retiros_hoy',
      nivel: NIVELES.retiros_hoy,
      titulo: `Hoy ${retiros.length === 1 ? 'retiran 1 auto' : `retiran ${retiros.length} autos`}`,
      detalle: retiros.map((r) => `${nombreAuto(r.cars)} · ${nombreCliente(r)}`).join('\n'),
      ids: retiros.map((r) => r.id),
      ver: 'cars',
      minutos: 0,
    });
  }

  const devoluciones = d.reservas.filter((r) => r.status === 'approved' && dia(r.returnDate) === hoy);
  if (devoluciones.length) {
    tareas.push({
      tipo: 'devoluciones_hoy',
      nivel: NIVELES.devoluciones_hoy,
      titulo: `Hoy ${devoluciones.length === 1 ? 'vuelve 1 auto' : `vuelven ${devoluciones.length} autos`}`,
      detalle: devoluciones.map((r) => `${nombreAuto(r.cars)} · ${nombreCliente(r)}`).join('\n'),
      ids: devoluciones.map((r) => r.id),
      ver: 'cars',
      minutos: 0,
    });
  }

  const vencidas = d.reservas.filter((r) => r.status === 'approved' && dia(r.returnDate) < hoy);
  if (vencidas.length) {
    tareas.push({
      tipo: 'completar_reservas',
      nivel: NIVELES.completar_reservas,
      titulo: `${plural(vencidas.length, 'reserva ya terminó', 'reservas ya terminaron')}: ${vencidas.length === 1 ? 'marcarla como completada' : 'marcarlas como completadas'}`,
      detalle: `Pasa la reserva a "completada" y el auto a "disponible".\n` + vencidas.map((r) => `${nombreAuto(r.cars)} · devolución ${dia(r.returnDate)}`).join('\n'),
      ids: vencidas.map((r) => r.id),
      ver: 'cars',
      minutos: vencidas.length,
    });
  }

  const sinFicha = d.autos.filter((a) => a.status !== 'inactive' && (!a.images?.length || !a.description?.trim()));
  if (sinFicha.length) {
    tareas.push({
      tipo: 'completar_fichas',
      nivel: NIVELES.completar_fichas,
      titulo: `${plural(sinFicha.length, 'auto tiene', 'autos tienen')} la ficha incompleta`,
      detalle: sinFicha.map((a) => `${nombreAuto(a)}: ${[!a.images?.length && 'sin fotos', !a.description?.trim() && 'sin descripción'].filter(Boolean).join(' y ')}`).join('\n'),
      ids: sinFicha.map((a) => a.id),
      ver: 'cars',
      minutos: 0,
    });
  }

  const taller = d.autos.filter((a) => a.status === 'maintenance');
  if (taller.length) {
    tareas.push({
      tipo: 'autos_en_taller',
      nivel: NIVELES.autos_en_taller,
      titulo: `${plural(taller.length, 'auto está', 'autos están')} en mantenimiento`,
      detalle: taller.map((a) => nombreAuto(a)).join(', ') + '. Cuando estén listos, pasalos a disponible.',
      ids: taller.map((a) => a.id),
      ver: 'cars',
      minutos: 0,
    });
  }

  const semana = ahora.getTime() - 7 * 24 * 60 * 60 * 1000;
  const bajas = d.resenas.filter((r) => r.rating <= 2 && new Date(r.created_at).getTime() >= semana);
  if (bajas.length) {
    tareas.push({
      tipo: 'resenas_bajas',
      nivel: NIVELES.resenas_bajas,
      titulo: `${plural(bajas.length, 'reseña baja', 'reseñas bajas')} esta semana`,
      detalle: bajas.map((r) => `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)} ${r.comment ? `“${r.comment.slice(0, 80)}”` : ''}`).join('\n') + '\nEstas las responde una persona.',
      ids: bajas.map((r) => r.id),
      ver: 'reviews',
      minutos: 0,
    });
  }

  return tareas;
}

/** Respuestas del asistente de cada módulo, a partir de los mismos datos (sin IA externa todavía). */
export type Modulo = 'dashboard' | 'cars' | 'reviews' | 'my-account';

export const PREGUNTAS: Record<Modulo, string[]> = {
  dashboard: ['¿Qué tengo que hacer hoy?', '¿Cuánto facturé este mes?', '¿Qué auto se reserva más?'],
  cars: ['¿Qué reservas están pendientes?', '¿Qué autos están libres hoy?', '¿Qué fichas están incompletas?'],
  reviews: ['¿Cómo vienen mis reseñas?', '¿Hay reseñas bajas para responder?'],
  'my-account': ['¿Qué datos me faltan completar?'],
};

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

export function responder(modulo: Modulo, pregunta: string, d: DatosFlota, ahora = new Date()): string {
  const q = pregunta.toLowerCase();
  const hoy = diaLocal(ahora);
  const tareas = revisarFlota(d, ahora);

  if (/hoy|hacer/.test(q) && !/libre/.test(q)) {
    return tareas.length ? tareas.map((t) => `• ${t.titulo}`).join('\n') : 'Por ahora no hay nada pendiente. 👌';
  }
  if (/factur|gan|mes/.test(q)) {
    const mes = hoy.slice(0, 7);
    const delMes = d.reservas.filter((r) => ['approved', 'completed'].includes(r.status) && dia(r.pickupDate).startsWith(mes));
    return `Este mes: ${plural(delMes.length, 'reserva', 'reservas')} aprobadas o completadas por ${pesos(delMes.reduce((t, r) => t + Number(r.totalPrice || 0), 0))}.`;
  }
  if (/m[aá]s|reserva m/.test(q) && /auto/.test(q)) {
    const cuenta = new Map<number, number>();
    d.reservas.forEach((r) => cuenta.set(r.car_id, (cuenta.get(r.car_id) || 0) + 1));
    const top = [...cuenta.entries()].sort((a, b) => b[1] - a[1])[0];
    const auto = top && d.autos.find((a) => a.id === top[0]);
    return auto ? `El más reservado es ${nombreAuto(auto)}, con ${plural(top[1], 'reserva', 'reservas')}.` : 'Todavía no hay reservas para comparar.';
  }
  if (/pendiente/.test(q)) {
    const p = d.reservas.filter((r) => r.status === 'pending');
    return p.length ? p.map((r) => `• ${nombreCliente(r)} · ${nombreAuto(r.cars)} · ${dia(r.pickupDate)} → ${dia(r.returnDate)} · ${pesos(r.totalPrice)}`).join('\n') : 'No hay reservas pendientes.';
  }
  if (/libre|disponible/.test(q)) {
    const ocupados = new Set(d.reservas.filter((r) => r.status === 'approved' && dia(r.pickupDate) <= hoy && dia(r.returnDate) >= hoy).map((r) => r.car_id));
    const libres = d.autos.filter((a) => a.status === 'available' && !ocupados.has(a.id));
    return libres.length ? `Libres hoy: ${libres.map(nombreAuto).join(', ')}.` : 'Hoy no hay autos libres.';
  }
  if (/ficha|incomplet|foto|descrip/.test(q)) {
    const t = tareas.find((x) => x.tipo === 'completar_fichas');
    return t ? t.detalle : 'Todas las fichas tienen fotos y descripción.';
  }
  if (/rese/.test(q)) {
    if (!d.resenas.length) return 'Todavía no hay reseñas.';
    const prom = d.resenas.reduce((t, r) => t + r.rating, 0) / d.resenas.length;
    const bajas = tareas.find((x) => x.tipo === 'resenas_bajas');
    return `Promedio ${prom.toFixed(1)} ★ en ${plural(d.resenas.length, 'reseña', 'reseñas')}.` + (bajas ? `\n${bajas.titulo}: conviene responderlas vos.` : '\nNo hay reseñas bajas esta semana.');
  }
  if (modulo === 'my-account' && /dato|complet/.test(q)) {
    return 'Revisá que tengan logo, teléfono y dirección: es lo primero que mira un cliente antes de reservar.';
  }
  return 'Por ahora respondo las preguntas sugeridas con los datos de tu panel. Cuando se conecte la IA, vas a poder preguntar cualquier cosa de este módulo.';
}
