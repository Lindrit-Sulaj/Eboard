import React from 'react'
import { getProject } from '@/actions/project'

export default async function ProjectPage({ params }: { params: { companyId: string, projectName: string }}) {
  const project = await getProject(params)

  return (
    <div>
      <pre>
        { JSON.stringify(project, null, 2) }
      </pre>
    </div>
  )
}
