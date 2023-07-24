"use client"
import { useSession, signIn } from 'next-auth/react'

export default function Home() {
  const session = useSession();

  return (
    <main>
      <p>Hello world</p>
      <pre>
        { JSON.stringify(session, null, 2) }
      </pre>
      <button onClick={() => signIn("github")}>Sign in with github</button>
    </main>
  )
}
