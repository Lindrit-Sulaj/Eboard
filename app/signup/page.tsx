"use client"
import React, { useState } from 'react'
import { Github } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [image, setImage] = useState("");

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
            <Input placeholder='Enter your name' id="name" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='email'>Email</Label>
            <Input placeholder='Enter your email' id="email" type="email" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='password'>Password</Label>
            <Input placeholder='Enter your password' id="password" type="password" className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input placeholder='Confirm your password' id='confirmPassword' type='password' className='mt-1' />
          </div>
          <div className='my-3'>
            <Label htmlFor='image'>Profile picture *</Label>
            <Input placeholder="Add your profile picture (url)" id="image" className='mt-1' />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          <Button variant="outline">Cancel</Button>
          <Button>Create account</Button>
        </CardFooter>
        <div className='px-6 pb-4'>
          <div className="flex justify-center items-center gap-4 mb-5">
            <Separator className='w-24' />
            <p className='text-zinc-400 text-sm uppercase'>Or continue with</p>
            <Separator className='w-24' />
          </div>
          <Button variant="outline" className='w-full'><Github size={20} className='mr-2' /> Github</Button>
        </div>
      </Card>
    </main>
  )
}
