"use client"
import React, { useEffect, useState } from 'react'
import { Role } from '@prisma/client'

import { useToast } from '@/components/ui/use-toast'
import { createInvitation } from '@/actions/invite'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/app/AuthProvider'

export default function InvitePage({ params }: { params: { [key: string]: string } }) {
  const user = useAuth();
  const { toast } = useToast();
  const member = user?.members.find(member => member.companyId === params.companyId)

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>('Editor')
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  async function handleCreateInvitation(e: React.FormEvent) {
    e.preventDefault();

    if (email === '') {
      return toast({
        title: 'Please enter the email field'
      })
    }

    setLoading(true);

    let data = {
      role: role as Role,
      email,
      message,
      companyId: params.companyId,
      senderName: member?.name!
    }

    return await createInvitation(data).then((res) => {
      if (res === "User already is a member") {
        return toast({
          title: 'User is already a member'
        })
      } else {
        return toast({
          title: 'User invited successfully'
        })
      }
    }
    ).finally(() => setLoading(false));
  }

  if (!user || !member) {
    return (
      <div>
        <h1>Error 405</h1>
      </div>
    )
  }

  if (member.role !== "Admin") {
    return (
      <div>
        <h1>Only admins can invite new members</h1>
      </div>
    )
  }

  return (
    <main className='flex flex-col justify-center items-center min-h-[calc(100vh-70px)]'>
      <Card className='bg-zinc-950 w-full max-w-lg'>
        <CardHeader>
          <CardTitle>Invite new members</CardTitle>
          <CardDescription>Invite your friends and coworkers.</CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateInvitation}>
          <CardContent>
            <div className="my-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder='johndoe@email.com' value={email} onChange={(e) => setEmail(e.target.value)} className='mt-1' required />
            </div>
            <div className='my-2'>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" className='mt-1 bg-zinc-950' value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Hi John and welcome to our company ...`} />
            </div>
            <div className="my-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className='mt-1 bg-zinc-950' id="role">
                  <SelectValue>{role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Reader">Reader</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex gap-2 w-full'>
              <Link href={`/dashboard/${params.companyId}`} className='w-1/2'>
                <Button variant="outline" className='w-full'>Cancel</Button>
              </Link>
              <Button className='w-1/2' disabled={loading}>{loading ? "Inviting user" : "Send invitation"}</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
