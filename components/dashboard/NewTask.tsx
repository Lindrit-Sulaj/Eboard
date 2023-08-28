"use client"
import React, { useState } from 'react'
import { Label as LabelPrisma, Priority, Project } from '@prisma/client'

import { createTask } from '@/actions/task'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useToast } from '../ui/use-toast'
import { useAuth } from '@/app/AuthProvider'



export default function NewTask({ project }: { project: Project }) {
  const user = useAuth();

  const member = user?.members.find(m => m.companyId === project.companyId)
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium")
  const [label, setLabel] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    return await createTask({ title, description: description || null, projectId: project.id, priority: priority as Priority, label: label ? label as LabelPrisma : null })
      .then(() => toast({ title: 'Task has been added', description: 'Refresh the page to view the new tasks list.' }))
      .catch(e => toast({ title: 'Something went wrong', description: 'The server returned an error: ' + e.message}))
      .finally(() => setLoading(false))
  }

  return (
    <Dialog>
      <DialogTrigger className={`h-10 px-4 py-2 dark:bg-zinc-50 dark:text-zinc-900 text-sm rounded-r-md ${member?.role === "Reader" && 'dark:bg-zinc-50/70'}`} disabled={member?.role === "Reader"}>
        New Task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>Press save when you're done.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="my-2">
            <Label htmlFor='title'>Title</Label>
            <Input id="title" placeholder='E.g. Finish exterior of main building' className='mt-1' value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="my-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority" className='mt-1'>
                <SelectValue placeholder='Medium' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder='Complete the exterior finishing of the main building according to design and quality standards... ' className='mt-1' value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="my-2">
            <Label htmlFor="label">Label</Label>
            <Select value={label} onValueChange={setLabel}>
              <SelectTrigger id="label" className='mt-1'>
                <SelectValue aria-label={label}>
                  { label || "Choose label"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feature">Feature</SelectItem>
                <SelectItem value="Request">Request</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
