'use client';
// Golondrina + asistente por módulo para el panel del proveedor.
// - Al entrar al panel, una vez por día, muestra el "Buen día" con lo que hay que hacer.
// - Lo que afecta a un cliente nunca lo hace sola: lo deja listo y se aprueba con un toque.
// - Cada pantalla del panel tiene su asistente, que responde con los datos de esa parte.
// Por ahora el asistente responde con reglas sobre los datos (sin IA externa); ver docs/GOLONDRINA.md.

import { useSupabase } from '@/context/SupabaseContext';
import {
  ActionIcon,
  Affix,
  Badge,
  Button,
  Drawer,
  Group,
  Indicator,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconMessageChatbot, IconSend } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  AutoFlota,
  DatosFlota,
  Modulo,
  PREGUNTAS,
  ResenaFlota,
  ReservaFlota,
  Tarea,
  diaLocal,
  responder,
  revisarFlota,
} from './reglas';

const LogoG = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={(size * 115) / 100} viewBox="0 0 100 115" fill="none" aria-hidden="true">
    <path d="M50 6L89 19C89 62 80 92 50 110C20 92 11 62 11 19Z" fill="#0B1220" stroke="#34D399" strokeWidth="7" strokeLinejoin="round" />
    <path d="M66 40H42L32 50V70L42 80H58L66 72V62H52" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="66" cy="40" r="6" fill="#34D399" />
    <circle cx="52" cy="62" r="6" fill="#34D399" />
  </svg>
);

// Las columnas a veces llegan en camelCase y a veces en minúscula (según cómo se creó la base).
const campo = <T,>(o: Record<string, unknown>, ...nombres: string[]): T | undefined => {
  for (const n of nombres) if (o[n] !== undefined && o[n] !== null) return o[n] as T;
  return undefined;
};

const normalizarReserva = (r: Record<string, unknown>): ReservaFlota => ({
  id: Number(r.id),
  car_id: Number(r.car_id),
  status: String(r.status),
  pickupDate: String(campo(r, 'pickupDate', 'pickupdate') ?? ''),
  returnDate: String(campo(r, 'returnDate', 'returndate') ?? ''),
  totalPrice: Number(campo(r, 'totalPrice', 'totalprice') ?? 0),
  created_at: r.created_at as string | undefined,
  users: (r.users as ReservaFlota['users']) ?? null,
  cars: (r.cars as ReservaFlota['cars']) ?? null,
});

interface Ctx {
  datos: DatosFlota | null;
  tareas: Tarea[];
  cargando: boolean;
  abrirBuenDia: () => void;
}
const GolondrinaCtx = createContext<Ctx>({ datos: null, tareas: [], cargando: true, abrirBuenDia: () => {} });
export const useGolondrina = () => useContext(GolondrinaCtx);

export const GolondrinaProvider = ({ providerId, children }: { providerId?: string; children: ReactNode }) => {
  const supabase = useSupabase();
  const router = useRouter();
  const [datos, setDatos] = useState<DatosFlota | null>(null);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [haciendo, setHaciendo] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!providerId) return;
    setCargando(true);
    const [autos, reservas, resenas] = await Promise.all([
      supabase.from('cars').select('*').eq('provider_id', providerId),
      supabase.from('bookings').select('*, users(firstName, lastName), cars(make, model)').eq('provider_id', providerId).order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').eq('provider_id', providerId).order('created_at', { ascending: false }),
    ]);
    if (autos.error || reservas.error || resenas.error) {
      console.warn('[Golondrina] no pude leer todos los datos', autos.error || reservas.error || resenas.error);
    }
    setDatos({
      autos: ((autos.data as unknown as AutoFlota[]) ?? []),
      reservas: ((reservas.data as unknown as Record<string, unknown>[]) ?? []).map(normalizarReserva),
      resenas: ((resenas.data as unknown as ResenaFlota[]) ?? []),
    });
    setCargando(false);
  }, [providerId, supabase]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const tareas = useMemo(() => (datos ? revisarFlota(datos) : []), [datos]);

  // El "Buen día" se abre solo una vez por día y por proveedor.
  useEffect(() => {
    if (!providerId || cargando || !tareas.length) return;
    const clave = `golondrina_buendia_${providerId}`;
    try {
      if (localStorage.getItem(clave) === diaLocal(new Date())) return;
      localStorage.setItem(clave, diaLocal(new Date()));
    } catch {
      // sin almacenamiento: se muestra igual
    }
    setAbierto(true);
  }, [providerId, cargando, tareas.length]);

  // Aprobar = hacer lo mismo que haría la persona desde la tabla de reservas.
  const aprobar = async (t: Tarea) => {
    if (!datos) return;
    setHaciendo(t.tipo);
    try {
      if (t.tipo === 'aprobar_reservas' || t.tipo === 'completar_reservas') {
        const nuevoEstadoReserva = t.tipo === 'aprobar_reservas' ? 'approved' : 'completed';
        const nuevoEstadoAuto = t.tipo === 'aprobar_reservas' ? 'booked' : 'available';
        for (const id of t.ids) {
          const r = datos.reservas.find((x) => x.id === id);
          if (!r) continue;
          const { error } = await supabase.from('bookings').update({ status: nuevoEstadoReserva }).eq('id', id);
          if (error) throw error;
          const { error: e2 } = await supabase.from('cars').update({ status: nuevoEstadoAuto }).eq('id', r.car_id);
          if (e2) throw e2;
        }
        toast.success(t.tipo === 'aprobar_reservas' ? 'Reservas aprobadas' : 'Reservas marcadas como completadas');
        await cargar();
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast.error('No se pudo completar. Probá desde la tabla de reservas.');
    } finally {
      setHaciendo(null);
    }
  };

  const ir = (t: Tarea) => {
    setAbierto(false);
    router.push(`/providers/${providerId}/${t.ver === 'dashboard' ? '' : t.ver}`);
  };

  const listos = tareas.filter((t) => t.nivel === 'ok');
  const paraVos = tareas.filter((t) => t.nivel === 'nunca');
  const hora = new Date().getHours();
  const saludo = hora < 13 ? 'Buen día' : hora < 20 ? 'Buenas tardes' : 'Buenas noches';

  const fila = (t: Tarea, acciones: ReactNode) => (
    <Paper key={t.tipo} withBorder p="sm" radius="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text fw={600} size="sm">{t.titulo}</Text>
          <Text size="xs" c="dimmed" style={{ whiteSpace: 'pre-line' }}>{t.detalle}</Text>
        </Stack>
        <Group gap={6} wrap="nowrap">{acciones}</Group>
      </Group>
    </Paper>
  );

  return (
    <GolondrinaCtx.Provider value={{ datos, tareas, cargando, abrirBuenDia: () => setAbierto(true) }}>
      {children}
      <Modal
        opened={abierto}
        onClose={() => setAbierto(false)}
        size="lg"
        radius="lg"
        title={
          <Group gap="sm" wrap="nowrap">
            <LogoG size={30} />
            <Stack gap={0}>
              <Text size="xs" c="teal" fw={700} tt="uppercase">Golondrina</Text>
              <Title order={4}>{saludo}. Esto es lo que hay para hoy</Title>
            </Stack>
          </Group>
        }
      >
        <Stack gap="md">
          {listos.length > 0 && (
            <Stack gap="xs">
              <Badge color="cyan" variant="light" w="fit-content">Listo para que lo apruebes</Badge>
              {listos.map((t) =>
                fila(
                  t,
                  <>
                    <Button size="xs" variant="default" onClick={() => ir(t)}>Ver</Button>
                    {(t.tipo === 'aprobar_reservas' || t.tipo === 'completar_reservas') && (
                      <Button size="xs" color="cyan" loading={haciendo === t.tipo} onClick={() => aprobar(t)}>
                        {t.tipo === 'aprobar_reservas' ? 'Aprobar' : 'Completar'}
                      </Button>
                    )}
                  </>
                )
              )}
            </Stack>
          )}
          {paraVos.length > 0 && (
            <Stack gap="xs">
              <Badge color="yellow" variant="light" w="fit-content">Para vos</Badge>
              {paraVos.map((t) => fila(t, <Button size="xs" variant="default" onClick={() => ir(t)}>Ver</Button>))}
            </Stack>
          )}
          {!tareas.length && <Text c="dimmed">No hay nada pendiente. 👌</Text>}
          <Text size="xs" c="dimmed">
            Golondrina no aprueba, rechaza ni responde nada sola: te lo deja listo y vos decidís.
          </Text>
        </Stack>
      </Modal>
    </GolondrinaCtx.Provider>
  );
};

/** Botón de la G para el encabezado: muestra cuántas cosas hay y abre el "Buen día". */
export const BotonGolondrina = () => {
  const { tareas, cargando, abrirBuenDia } = useGolondrina();
  return (
    <Tooltip label="Golondrina: lo que hay para hoy">
      <Indicator label={tareas.length} size={16} color="teal" disabled={cargando || !tareas.length} offset={4}>
        <ActionIcon variant="subtle" size="lg" radius="xl" onClick={abrirBuenDia} aria-label={`Golondrina: ${tareas.length} cosas para hoy`}>
          <LogoG size={20} />
        </ActionIcon>
      </Indicator>
    </Tooltip>
  );
};

const NOMBRE_MODULO: Record<Modulo, string> = {
  dashboard: 'Asistente del panel',
  cars: 'Asistente de autos y reservas',
  reviews: 'Asistente de reseñas',
  'my-account': 'Asistente de la cuenta',
};

const moduloDe = (path: string): Modulo => {
  if (/\/cars/.test(path)) return 'cars';
  if (/\/reviews/.test(path)) return 'reviews';
  if (/\/my-account/.test(path)) return 'my-account';
  return 'dashboard';
};

interface Mensaje { de: 'yo' | 'bot'; texto: string }

/** Asistente flotante: cambia según la pantalla del panel en la que estás. */
export const AsistenteModulo = () => {
  const { datos, cargando } = useGolondrina();
  const modulo = moduloDe(usePathname() || '');
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState('');
  const [chats, setChats] = useState<Partial<Record<Modulo, Mensaje[]>>>({});
  const vista = useRef<HTMLDivElement>(null);
  const chat = chats[modulo] ?? [{ de: 'bot', texto: `Hola, soy el ${NOMBRE_MODULO[modulo].toLowerCase()}. Te respondo con los datos de esta parte del panel.` }];

  const preguntar = (q: string) => {
    if (!q.trim() || !datos) return;
    setChats((c) => ({ ...c, [modulo]: [...chat, { de: 'yo', texto: q }, { de: 'bot', texto: responder(modulo, q, datos) }] }));
    setTexto('');
  };

  // La respuesta se lee desde el principio: arriba queda la pregunta.
  useEffect(() => {
    const el = vista.current;
    if (!el) return;
    const preguntas = el.querySelectorAll('[data-yo]');
    const ultima = preguntas[preguntas.length - 1] as HTMLElement | undefined;
    el.scrollTo({ top: ultima ? ultima.offsetTop - 8 : 0, behavior: 'smooth' });
  }, [chat.length]);

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button leftSection={<IconMessageChatbot size={18} />} radius="xl" color="cyan" onClick={() => setAbierto(true)}>
          Asistente
        </Button>
      </Affix>
      <Drawer opened={abierto} onClose={() => setAbierto(false)} position="right" size="md" title={<Text fw={700}>{NOMBRE_MODULO[modulo]}</Text>}>
        <Stack h="calc(100dvh - 90px)" gap="sm">
          <ScrollArea style={{ flex: 1 }} viewportRef={vista}>
            <Stack gap="xs" pr="xs">
              {chat.map((m, i) => (
                <Paper
                  key={i}
                  data-yo={m.de === 'yo' ? '' : undefined}
                  p="xs"
                  radius="md"
                  withBorder={m.de === 'bot'}
                  bg={m.de === 'yo' ? 'cyan.6' : undefined}
                  c={m.de === 'yo' ? 'white' : undefined}
                  style={{ alignSelf: m.de === 'yo' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}
                >
                  <Text size="sm" style={{ whiteSpace: 'pre-line' }}>{m.texto}</Text>
                </Paper>
              ))}
              {cargando && <Loader size="sm" />}
            </Stack>
          </ScrollArea>
          <Group gap={6}>
            {PREGUNTAS[modulo].map((p) => (
              <Button key={p} size="compact-xs" variant="light" radius="xl" disabled={!datos} onClick={() => preguntar(p)}>
                {p}
              </Button>
            ))}
          </Group>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              preguntar(texto);
            }}
          >
            <Group gap={6} wrap="nowrap">
              <TextInput
                style={{ flex: 1 }}
                placeholder="Escribile al asistente…"
                value={texto}
                onChange={(e) => setTexto(e.currentTarget.value)}
                aria-label="Pregunta para el asistente"
              />
              <ActionIcon type="submit" size="lg" color="cyan" aria-label="Enviar" disabled={!datos}>
                <IconSend size={16} />
              </ActionIcon>
            </Group>
          </form>
        </Stack>
      </Drawer>
    </>
  );
};
