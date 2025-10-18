'use client';
import { IUserProfileContext } from '@/models/app';
import { IReqUserProps } from '@/models/req.model';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useState } from 'react';
import { useSupabase } from './SupabaseContext';
import { IResUserProps } from '@/models/res.model';

const UserProfileContext = createContext<IUserProfileContext>(undefined as any);

interface Props {
  children: ReactNode;
}
export const UserProfileContextProvider = ({ children }: Props) => {
  const [profileDetails, setProfileDetails] = useState<IResUserProps | null>(
    null
  );
  const supabase = useSupabase();
  const router = useRouter();

  const getProfileDetails = async () => {
    const res = await supabase.auth.getSession();

    let { data: user } = await supabase
      .from('users')
      .select('*, regions(name)')
      .match({ id: res.data.session?.user.id })
      .single();
    return user;
  };

  const updateProfileInfo = async (user: any) => {
    const { error } = await supabase.auth.updateUser({ data: { ...user } });
    if (error) throw new Error(error.message);

    const { error: updateUserError } = await supabase.auth.refreshSession();

    if (updateUserError) throw new Error(updateUserError.message);

    router.refresh();
  };

  const updateAvatar = async (avatarUrl: string) => {
    // update user avatar url
    await updateProfileInfo({
      avatar: avatarUrl,
    });
  };

  return (
    <UserProfileContext.Provider
      value={{
        getProfileDetails,
        updateProfileInfo,
        updateAvatar,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  return context;
};
