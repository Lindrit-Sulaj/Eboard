"use client"
import { useSession, signIn } from 'next-auth/react'
import { useAuth } from './AuthProvider';

export default function Home() {
  const session = useAuth();

  return (
    <main>
      <p>Hello world</p>
      
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non rerum eligendi accusamus possimus numquam, autem perspiciatis voluptate odio explicabo velit doloremque, voluptas mollitia consectetur dignissimos reprehenderit quaerat esse eaque accusantium!</p>
      
      <pre>
        { JSON.stringify(session, null, 2) }
      </pre>
      <button onClick={() => signIn("github", { redirect: true })}>Sign in with github</button>
    </main>
  )
}
