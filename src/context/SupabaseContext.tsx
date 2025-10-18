import { ISupabaseContext } from '@/models/app';
import { Database } from '@/models/supabase';
import { createBrowserClient } from '@supabase/ssr';
import React, { ReactNode, createContext, useContext } from 'react';

export const SupabaseContext = createContext<ISupabaseContext>(
  undefined as any
);

interface Props {
  children: ReactNode;
}
export const SupabaseContextProvider = ({ children }: Props) => {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const { supabase } = useContext(SupabaseContext);
  return supabase;
};
