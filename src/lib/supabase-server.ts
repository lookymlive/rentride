/**
 * @fileoverview Utilidades centralizadas para crear clientes Supabase del lado del servidor
 * @module lib/supabase-server
 * 
 * Este módulo proporciona funciones helper para crear clientes Supabase configurados
 * correctamente para uso en Server Components, Server Actions y API Routes.
 * 
 * SEGURIDAD: Siempre usa getUser() en lugar de getSession() para validar tokens
 * contra el servidor de Supabase Auth.
 */

import { Database } from '@/models/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Crea un cliente Supabase del lado del servidor con manejo seguro de cookies
 * 
 * Este cliente es apropiado para:
 * - Server Components
 * - Server Actions ('use server')
 * - Route Handlers (API Routes)
 * 
 * @returns Cliente Supabase configurado con acceso a cookies
 * 
 * @example
 * ```typescript
 * import { createSupabaseServerClient } from '@/lib/supabase-server';
 * 
 * export async function getUser() {
 *   const supabase = await createSupabaseServerClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   return user;
 * }
 * ```
 */
export const createSupabaseServerClient = async () => {
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
 * Obtiene el usuario autenticado de forma segura
 * 
 * IMPORTANTE: Esta función usa getUser() que valida el token contra el servidor
 * de Supabase Auth, a diferencia de getSession() que solo lee las cookies.
 * 
 * @returns Usuario autenticado o null si no hay sesión válida
 * 
 * @example
 * ```typescript
 * import { getAuthenticatedUser } from '@/lib/supabase-server';
 * 
 * export default async function ProtectedPage() {
 *   const user = await getAuthenticatedUser();
 *   
 *   if (!user) {
 *     redirect('/login');
 *   }
 *   
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export const getAuthenticatedUser = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    
    // SEGURIDAD: getUser() valida el token con el servidor de Supabase
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[getAuthenticatedUser] Auth error:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('[getAuthenticatedUser] Error:', error);
    return null;
  }
};

/**
 * Verifica si hay un usuario autenticado
 * 
 * @returns true si hay un usuario autenticado, false en caso contrario
 * 
 * @example
 * ```typescript
 * import { isAuthenticated } from '@/lib/supabase-server';
 * 
 * export async function checkAccess() {
 *   const authenticated = await isAuthenticated();
 *   
 *   if (!authenticated) {
 *     throw new Error('Unauthorized');
 *   }
 * }
 * ```
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getAuthenticatedUser();
  return user !== null;
};
