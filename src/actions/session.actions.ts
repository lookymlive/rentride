'use server';
import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Crea un cliente Supabase del lado del servidor con manejo seguro de cookies
 * @returns Cliente Supabase configurado
 */
const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
};

/**
 * Obtiene la sesión del usuario autenticado de forma segura
 * Usa getUser() para verificar la autenticidad del token con el servidor de Supabase
 * @returns Session si el usuario está autenticado, null en caso contrario
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const supabase = await createSupabaseServerClient();

    // SEGURIDAD: Usar getUser() valida el token contra el servidor de Supabase
    // getSession() solo lee las cookies sin validación, lo cual es inseguro
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Una vez verificado el usuario, obtenemos la sesión completa
    const { data } = await supabase.auth.getSession();
    
    return data.session;
  } catch (error) {
    console.error('[getSession] Error:', error);
    return null;
  }
};

// checking if logged in user has provider role
const isProvider = (session: Session) => {
  return (
    session.user?.user_metadata.role &&
    session.user?.user_metadata.role === 'provider'
  );
};

/**
 * Verifica si el usuario tiene rol de proveedor y redirige si es necesario
 * @returns Session si es usuario normal, redirige si es proveedor, null si no está autenticado
 */
export const isProviderSession = async (): Promise<Session | null> => {
  try {
    const supabase = await createSupabaseServerClient();

    // SEGURIDAD: Validar usuario con el servidor
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data } = await supabase.auth.getSession();

    if (data.session && isProvider(data.session)) {
      redirect(`/providers/${data.session.user.id}`);
    }

    return data.session;
  } catch (error) {
    console.error('[isProviderSession] Error:', error);
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado y redirige según su rol
 * Redirige a /providers/[id] si es proveedor, a / si es usuario normal
 */
export const isLoggedIn = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    
    // SEGURIDAD: Validar usuario con el servidor
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return;
    }

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      if (isProvider(data.session)) {
        redirect(`/providers/${data.session.user?.id}`);
      } else {
        redirect('/');
      }
    }
  } catch (error) {
    console.error('[isLoggedIn] Error:', error);
  }
};
