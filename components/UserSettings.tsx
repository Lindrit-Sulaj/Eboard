"use client"
import React, { FormEvent } from 'react'
import { useState } from 'react'

import { updateUser } from '@/actions/user'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export default function UserSettings() {
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const user = await updateUser({name, password})

    .then(user => (
      toast({
        title: 'User updated successfully',
        description: "Refresh the page to see the updated changes"
      })
    )).catch(err => (
      toast({
        title: "Something went wrong",
        description: "Please try again."
      })
    ));
  }

  return (
    <>
      <div className="heading">
        <h2 className='font-semibold text-xl md:text-2xl'>Settings</h2>
        <p className='text-sm text-zinc-400 max-w-2xl'>Configure and personalize your account preferences.</p>
      </div>
      <div className="account bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-md mt-4">
        <div className="px-4 pt-4 pb-2">
          <h4 className='font-semibold text-lg'>Your profile</h4>
          <p className='text-zinc-400 text-sm'>Change your name or password</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='my-2 max-w-[380px] px-4'>
            <Label htmlFor='name'>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className='mt-1' id="name" />
          </div>
          <div className='my-2 max-w-[380px] px-4'>
            <Label htmlFor='password'>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} className='mt-1' id="password" />
          </div>
          <div className='mt-6 flex justify-end bg-neutral-900 py-3 px-4 border-solid border-t-[1px] border-t-zinc-800'>
            <Button size="sm">Save changes</Button>
          </div>
        </form>
      </div>
      <div className="mt-6 bg-zinc-950 border-solid border-zinc-800 p-4 rounded-md border-[1px]">
        <p className="text-center text-zinc-300">More options are coming soon</p>
      </div>
    </>
  )
}
