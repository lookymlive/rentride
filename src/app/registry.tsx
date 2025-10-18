'use client';

import { AppContextProvider } from '@/context/AppContext';
import { AuthContextProvider } from '@/context/AuthContext';
import { SupabaseContextProvider } from '@/context/SupabaseContext';
import { UserProfileContextProvider } from '@/context/UserProfileContext';
import '@mantine/carousel/styles.css';
import { Box, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { createBrowserClient } from '@supabase/ssr';
import type { Session, User } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import type { Database } from '@/models/supabase';

const queryClient = new QueryClient();

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | undefined>(undefined);

  // subscribing to auth state change
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <SupabaseContextProvider>
      <AuthContextProvider user={user} session={session}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AppContextProvider>
            <UserProfileContextProvider>
              <MantineProvider defaultColorScheme="dark">
                <Box>
                  {children}
                  <ToastContainer />
                </Box>
              </MantineProvider>
            </UserProfileContextProvider>
          </AppContextProvider>
        </QueryClientProvider>
      </AuthContextProvider>
    </SupabaseContextProvider>
  );
}
