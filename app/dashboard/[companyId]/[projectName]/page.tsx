import React from 'react'

import { Button } from '@/components/ui/button';
import { getProject } from '@/actions/project'
import NewTask from '@/components/dashboard/NewTask';
import Tasks from '@/components/dashboard/Tasks';

export default async function ProjectPage({ params }: { params: { companyId: string, projectName: string } }) {
  const project = await getProject({ companyId: params.companyId, projectName: params.projectName.split("%20").join(' ') });
  const tasks: number = project?.tasks.length!

  if (!project) {
    return (
      <div>
        <pre>
          {JSON.stringify(params, null, 2)}
        </pre>
        Page not found
      </div>
    )
  }

  return (
    <main>
      <div className='bg-zinc-950 border-solid border-y-[1px] border-y-zinc-800 py-6'>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 md:px-0">
          <div>
            <h1 className='font-semibold text-2xl'>{project.title}</h1>
            <p className='text-[15px] text-zinc-400'>{tasks} {tasks === 1 ? "task" : "tasks"}</p>
          </div>
          <div className='font-medium'>
            <Button className='rounded-r-none' variant="outline">
              { project.manager ? project.manager.name : "No manager"}
            </Button>
            <NewTask project={project} />
          </div>
        </div>
      </div>
      <Tasks tasks={project.tasks} project={project} />
    </main>
  )
}
