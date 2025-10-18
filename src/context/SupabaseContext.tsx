import { ISupabaseContext } from '@/models/app';
import { Database } from '@/models/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { ReactNode, createContext, useContext } from 'react';

export const SupabaseContext = createContext<ISupabaseContext>(
  undefined as any
);

interface Props {
  children: ReactNode;
}
export const SupabaseContextProvider = ({ children }: Props) => {
  const supabase = createClientComponentClient<Database>();

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
