"use client"
import React, { useState, useEffect, useContext, createContext } from 'react'
import { SessionProvider, useSession } from "next-auth/react";
import type { User } from '@prisma/client'

import { getUser } from '@/actions/user';

const ClientContext = createContext<null | User>(null);
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
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);

    if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
      return;
    };

    async function loadUser() {
      const user = await getUser()
        .then(res => setUser(res))
        .catch(err => alert(err))
        .finally(() => {
          setLoading(false)
        });

      return user;
    }

    loadUser();
  }, [status])

  return (
    <ClientContext.Provider value={user}>
      {loading ? <p>Loading...</p> : children}
    </ClientContext.Provider>
  )
}