"use client"
import React, { useState } from 'react'
import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'

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
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [image, setImage] = useState("");

  async function handleSubmit() {
    if (!name || !email || !password || !confirmPassword) {
      return toast({
        title: 'Please enter all of the required fields',
        description: "Name, Email, Password and Confirm Password fiels shouldn't be empty",
      })
    }

    if (password !== confirmPassword) {
      return toast({
        title: "Passwords don't match",
        description: "The passwords you provided don't match. Check them again"
      })
    }

    if (name.length < 3) {
      return toast({
        title: 'Name should be 3 characters or more',
      })
    }

    await signUpUser({
      name,
      email,
      password,
    })
    await signIn("credentials", {
      email,
      password,
      callbackUrl: `${window.location.origin}/`
    })
  }

  return (
    <main className='h-[calc(100vh-67px)] flex justify-center items-center px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create your free account</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} id="name" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='email'>Email</Label>
            <Input placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='password'>Password</Label>
            <Input placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id='confirmPassword' type='password' className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='image'>Profile picture *</Label>
            <Input placeholder="Add your profile picture (url)" value={image} onChange={(e) => setImage(e.target.value)} id="image" className='mt-1' />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Create account</Button>
        </CardFooter>

        <OAuth />
      </Card>
    </main>
  )
}
