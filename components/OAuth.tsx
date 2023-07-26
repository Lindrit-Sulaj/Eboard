"use client"
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Github } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Separator } from './ui/separator'
import { Button } from './ui/button'

export default function OAuth() {
  const router = useRouter();

  async function handleGithubSignin() {
    return await signIn("github", {
      callbackUrl: `${window.location.origin}/`
    })
  }

  return (
    <div className='px-6 pb-4'>
      <div className="flex justify-center items-center gap-2 md:gap-4 mb-5">
        <Separator className='w-10 md:w-24' />
        <p className='text-zinc-400 text-sm uppercase whitespace-nowrap'>Or continue with</p>
        <Separator className='w-10 md:w-24' />
      </div>
      <Button variant="outline" onClick={handleGithubSignin} className='w-full'><Github size={20} className='mr-2' onClick={() => signIn("github")} /> Github</Button>
    </div>
  )
}
