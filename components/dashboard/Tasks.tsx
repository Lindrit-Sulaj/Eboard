"use client"

import React, { useState } from 'react'
import { Project, Status, Task } from '@prisma/client'

import { deleteTask, editTask } from '@/actions/task'
import TaskColumn from './TaskColumn'

const taskStatus: { val: string, label: string }[] = [
  {
    val: "Todo",
    label: "Todo"
  },
  {
    val: "In_progress",
    label: "In progress"
  },
  {
    val: "Completed",
    label: "Completed"
  }
]

export default function Tasks(props: { project: Project, tasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[] | null>(props.tasks)

  function tasksDispatch(action: { type: 'Edit' | 'Delete' | 'Complete', payload: { [key:string]: any }}) {
    switch (action.type) {
      case 'Delete': {
        const newTasks = tasks?.filter(task => task.id !== action.payload.id)!;
        setTasks(newTasks)

        deleteTask(action.payload.id)
      }
      break;
      case 'Complete': {
        const newTasks = tasks?.map(task => task.id === action.payload.id ? { ...task, status: "Completed" as Status } : task)!;
        setTasks(newTasks)

        editTask(action.payload.id, { status: 'Completed' })
      }
      break;
    }
  }

  return (
    <div className='grid grid-cols-3 max-w-screen-xl mx-auto my-6 gap-6'>
      { taskStatus.map(t => (
        <TaskColumn key={t.val} tasks={tasks?.filter(task => task.status === t.val)!} label={t.label} dispatch={tasksDispatch} />
      )) }
    </div>
  )
}
