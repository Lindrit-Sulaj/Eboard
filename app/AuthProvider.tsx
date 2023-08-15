"use client"
import React, { useState, useEffect, useContext, createContext } from 'react'
import { SessionProvider, useSession } from "next-auth/react";
import type { Member, User } from '@prisma/client'
import Spinner from '@/components/Spinner';

import { getUser } from '@/actions/user';

const ClientContext = createContext<null | User & { members: Member[] }>(null);
export const useAuth = () => useContext(ClientContext)


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClientProvider>
        {children}
      </ClientProvider>
    </SessionProvider>
  )
}

function ClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<null | User & { members: Member[] }>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    if (status === "unauthenticated") {
      setLoading(false);
      return setUser(null)
    };

    async function loadUser() {
      const user = await getUser()
        .then(res => setUser(res))
        .catch(err => console.info(err))

      setLoading(false)
      return user;
    }
    
    loadUser();
  }, [status])

  return (
    <ClientContext.Provider value={user}>
      {loading ? <Spinner /> : children}
    </ClientContext.Provider>
  )
}