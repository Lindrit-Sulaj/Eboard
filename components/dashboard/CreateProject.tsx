"use client"
import React, { FormEvent, useState } from 'react'
import { Member, Priority } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { createProject } from '@/actions/project'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/use-toast'

export default function CreateProject({ members, companyId }: { members: Member[], companyId: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium');
  const [manager, setManager] = useState('')
  const [loading, setLoading] = useState(false);

  async function handleCreateProject(e: FormEvent) {
    e.preventDefault();

    if (name.length === 0) {
      return toast({
        title: 'Please enter the name'
      })
    }

    setLoading(true);

    return await createProject({ title: name, description, priority: priority as Priority, managerId: manager, companyId })
      .then((p) => router.push(`/dashboard/${companyId}/${p.title}`))
      .catch((e) => toast({ title: `Something went wrong: ${e.message}`}) )
      .finally(() => setLoading(false))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>Create a new project to organize tasks, collaborate with your team, and drive your business forward.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateProject}>
          <div className="my-2">
            <Label htmlFor="name">Name:</Label>
            <Input className='mt-1' id="name" name="name" placeholder='Enter project name' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="my-2">
            <Label htmlFor="description">Description</Label>
            <Textarea className='mt-1' id="description" name="description" placeholder='Enter project description (optional)' value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="my-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className='mt-1' id="priority">
                <SelectValue>
                  {priority}
                </SelectValue>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
          <div className="my-2">
            <Label htmlFor="manager">Manager</Label>
            <Select value={manager} onValueChange={setManager}>
              <SelectTrigger className='mt-1' id='manager'>
                <SelectValue>
                  {members.find(m => m.id === manager)?.name || "Choose manager (optional)"}
                </SelectValue>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {members.map(member => (
                    <SelectItem key={member.id} disabled={member.role === "Reader"} value={member.id}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">{loading ? "Creating project..." : "Create project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
