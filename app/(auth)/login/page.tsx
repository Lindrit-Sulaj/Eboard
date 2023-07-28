"use client"
import React, { useState, useEffect } from 'react'
import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { signUpUser } from '@/actions/user'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import OAuth from '@/components/OAuth'
import { useToast } from '@/components/ui/use-toast'

export default function SignupPage() {
  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (email === "" || password === "") {
      return toast({
        title: "Please enter both fields",
        description: 'In order to log into your account, please enter your email and password.'
      })
    }

    setLoading(true);

    await signIn("credentials", {
      email,
      password,
      callbackUrl: `${window.location.origin}/`
    }).catch(err => (
      toast({
        title: 'Something went wrong',
        description: err.message
      })
    )).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push('/')
    }
  }, [])

  return (
    <main className='h-[calc(100vh-67px)] flex justify-center items-center px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Log in to your existin account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-3'>
            <Label htmlFor='email'>Email</Label>
            <Input placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='password'>Password</Label>
            <Input placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" className='mt-1' />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </CardFooter>

        <OAuth />
      </Card>
    </main>
  )
}
