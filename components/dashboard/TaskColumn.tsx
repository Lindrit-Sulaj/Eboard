"use client"
import React from 'react'
import type { Task as TaskInterface } from '@prisma/client'

import { Trash2, CheckCircle2 } from 'lucide-react'

import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export default function TaskColumn({ tasks, label, dispatch }: { tasks: TaskInterface[] | null, label: string, dispatch: any }) {
  return (
    <div>
      <div className='flex items-center gap-2'>
        <span className="w-2 h-2 block rounded-full bg-orange-300"></span>
        <h6>{label}</h6>
      </div>
      <div className="flex flex-col gap-y-4 mt-3">
        {tasks?.map(task => (
          <Task key={task.id} task={task} dispatch={dispatch}/>
        ))}
      </div>
    </div>
  )
}

export function Task({ task, dispatch }: { task: TaskInterface, dispatch: any }) {
  return (
    <div className='bg-zinc-950 border-solid border-[1px] border-zinc-800 p-4 rounded-md'>
      <p className='font-medium'>{task.title} <Badge className={`${!task.label && "dark:bg-zinc-700 dark:text-white hover:dark:bg-zinc-600 hover:dark:text-white"}`}>{task.label ? task.label : 'No label'}</Badge></p>
      {task.description && <p className='text-[15px] text-zinc-300 mt-1'>{task.description}</p>}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className='text-red-300 rounded-r-none'>
          <Trash2 size={16} />
        </Button>
        <Button size="sm" variant="outline" className='rounded-none'>Edit</Button>
        <Button size="sm" onClick={() => dispatch({ type: 'Complete', payload: { id: task.id }})} variant="outline" className='text-green-300 rounded-l-none' disabled={task.status === "Completed"}>
          <CheckCircle2 size={14} className='mr-1' /> { task.status === "Completed" ? task.status : 'Complete'}
        </Button>
      </div>
    </div>
  )
}
