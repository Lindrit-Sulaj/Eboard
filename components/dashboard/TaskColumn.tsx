"use client"
import React, { useState, useEffect } from 'react'
import type { Priority, Status, Task as TaskInterface } from '@prisma/client'
import { usePathname } from 'next/navigation'

import { Trash2, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAuth } from '@/app/AuthProvider'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '../ui/select'

export default function TaskColumn({ tasks, label, dispatch }: { tasks: TaskInterface[] | null, label: string, dispatch: any }) {
  return (
    <div>
      <div className='flex items-center gap-2'>
        <span className="w-2 h-2 block rounded-full bg-orange-300"></span>
        <h6>{label}</h6>
      </div>
      <div className="flex flex-col gap-y-4 mt-3">
        {tasks?.map(task => (
          <Task key={task.id} task={task} dispatch={dispatch} />
        ))}
      </div>
    </div>
  )
}

export function Task({ task, dispatch }: { task: TaskInterface, dispatch: any }) {
  const path = usePathname();
  const user = useAuth();

  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  const member = user?.members.find(m => m.companyId === path.split('/')[2])!

  function handleSave() {
    dispatch({ type: 'Edit', payload: { id: task.id, status, priority, assigneeId: status === "In_progress" ? user?.id! : null } })
  }

  return (
    <div className='bg-zinc-950 border-solid border-[1px] border-zinc-800 p-4 rounded-md'>
      <div className='font-medium'><span>{task.title}</span> <Badge className={`${!task.label && "dark:bg-zinc-700 dark:text-white hover:dark:bg-zinc-600 hover:dark:text-white"}`}>{task.label ? task.label : 'No label'}</Badge></div>
      {task.description && <p className='text-[15px] text-zinc-300 mt-1'>{task.description}</p>}
      <div className={`flex justify-between items-center ${task.description ? "mt-1" : "mt-3"}`}>
        <p className='text-sm text-blue-300'>{task.priority ? `${task.priority} priority` : ''}</p>

        <div className="flex">
          <Button disabled={member.role === "Reader"} size="sm" variant="outline" onClick={() => dispatch({ type: 'Delete', payload: { id: task.id } })} className='text-red-300 rounded-r-none'>
            <Trash2 size={16} />
          </Button>
          <Dialog>
            <DialogTrigger disabled={member.role === "Reader"} className='px-3 border-solid border-y-[1px] text-sm border-y-zinc-800 dark:hover:bg-zinc-800 transition-all'>
              Open
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogDescription>{task.description || "No available description"}</DialogDescription>
              </DialogHeader>

              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as Status)}>
                  <SelectTrigger className='mt-1'>
                    <SelectValue aria-label={status}>
                      {status}
                    </SelectValue>
                    <SelectContent>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value='In_progress'>In progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                  <SelectTrigger className='mt-1'>
                    <SelectValue aria-label={priority}>
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

              <div className="flex gap-1 justify-end">
                <Button variant="destructive" onClick={() => dispatch({ type: 'Delete', payload: { id: task.id } })}>Delete</Button>
                <Button variant="secondary" onClick={handleSave}>Save & exit</Button>
              </div>

            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={() => dispatch({ type: 'Complete', payload: { id: task.id } })} variant="outline" className='text-green-300 rounded-l-none' disabled={task.status === "Completed" || member.role === "Reader"}>
            <CheckCircle2 size={14} className='mr-1' /> {task.status === "Completed" ? task.status : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
