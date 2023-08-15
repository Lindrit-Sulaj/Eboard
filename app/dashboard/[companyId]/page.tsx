import React from 'react'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Menu from '@/components/dashboard/Menu'
import { Industry } from '@/ts/data'
import { getCompany } from '@/actions/company'
import { getMember } from '@/actions/member'
import { Separator } from '@/components/ui/separator'
import Settings from '@/components/dashboard/Settings'

export default async function CompanyPage({ params, searchParams }: { params: { [key: string]: string }, searchParams: { [key: string]: string } }) {
  const member = await getMember(params.companyId)
  const company = await getCompany(params.companyId)

  if (!member) {
    return (
      <div>
        Where do you think you're going
      </div>
    )
  }

  if (!company) {
    return (
      <div>
        Company doesn't exist
      </div>
    )
  }

  return (
    <main>
      <Menu />
      {(searchParams.tab === "" || !searchParams.hasOwnProperty("tab")) ? (
        <div>
          <div className='bg-zinc-950 border-solid border-b-[1px] border-zinc-800 py-10 px-4'>
            <div className='max-w-screen-xl mx-auto'>
              <div className="flex gap-2 items-center">
                <p className='text-zinc-400'>{Industry[company?.industry!]}</p>
                {company.location && <p className='flex items-center gap-1 text-sm'><MapPin size={16} /> {company.location}</p>}
              </div>
              <h1 className='font-bold text-3xl mt-2'>{company?.name}</h1>
              <p className='text-zinc-200 text-[15px] mt-1 max-w-xl'>{company?.description}</p>
              <a className='mt-2 block underline underline-offset-1' href={company.website!}>{company.website}</a>
            </div>

          </div>
          <section className='py-12 max-w-screen-xl mx-auto'>
            <div className='flex justify-between items-center'>
              <h2 className='font-semibold text-xl'>Projects</h2>
              <Link href={`/dashboard/${params.companyId}/new-project`}>
                <Button>New project</Button>
              </Link>
            </div>
            {company.projects.length > 0 ? (
              <div className="grid grid-cols-3 mt-2">
                {company.projects.map(project => (
                  <div className='bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-md p-7 hover:border-zinc-600 cursor-pointer transition-all' key={project.id}>

                    <h3 className='font-semibold text-[17px] flex items-center gap-2'>
                      {project.title}
                      <Badge>{project.priority} Priority</Badge>
                    </h3>
                    <p className='text-[15px] text-zinc-400 mt-1'>{project.description}</p>

                    <div className='flex justify-end gap-2 mt-2'>
                      <Button variant={"outline"} size="sm">
                        {project.assignedUsers.includes(member.userId) ? "Assigned" : "Not assigned"}
                      </Button>
                      <Link href={`/dashboard/${params.companyId}/${project.title}/`}>
                        <Button size="sm">
                          Visit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-[15px] text-center text-zinc-400 mt-6'>
                No projects yet. <Link className='text-zinc-200' href={`/dashboard/${params.companyId}/new-project`}>Create one</Link>
              </div>
            )}


          </section>
        </div>
      ) : searchParams.tab === "members" ? (
        <div className="max-w-screen-xl mx-auto my-10 bg-zinc-950 rounded-md border-solid border-[1px] p-6 border-zinc-800">
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'>Members</h2>
            <Link href={member.role === "Admin" ? `/dashboard/${params.companyId}/invite` : ''}>
              <Button size="sm" disabled={member.role !== "Admin"}>Send invitation</Button>
            </Link>
          </div>
          <div className='max-w-screen-xl mx-auto mt-5 flex flex-col gap-y-3'>
            {company.members.map(member => (
              <>
                <div key={member.id} className='py-2 flex justify-between items-center'>
                  <div>
                    <h5 className='flex gap-2 items-center font-semibold'>
                      {member.image && <img className='w-6 rounded-full h-6 aspect-square' src={member.image} alt={member.name} />}
                      {member.name}
                    </h5>
                    <p className='text-sm text-zinc-400 mt-1'>{member.email}</p>
                  </div>
                  <Badge className={`py-[6px] ${member.role === "Admin" ? "dark:bg-blue-400" : "bg-white"}`}>{member.role}</Badge>
                </div>
                <Separator className='border-zinc-900' />
              </>
            ))}
          </div>
        </div>

      ) : searchParams.tab === "settings" ? (
        <Settings currentMember={member} company={company} />
      ) : (
        <div>
          This tab doesn't exist
        </div>
      )}
    </main>
  )
}
