"use client"

import React, { useEffect, useState } from 'react'
import { Company, Invitation, Member, Priority, Project } from '@prisma/client'
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { editCompany } from '@/actions/company';
import { getInvitations, deleteInvitation } from '@/actions/invite';
import { deleteProject, editProject } from '@/actions/project';

import CompanyMember from './CompanyMember';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle } from '../ui/dialog';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SettingsProps {
  company: Company & { members: Member[], projects: Project[] };
  currentMember: Member;
}

const allPanels: ["General", "Roles", "Invitations", "Projects"] = ["General", "Roles", "Invitations", "Projects"]

export default function Settings({ company, currentMember }: SettingsProps) {
  const [panel, setPanel] = useState<"General" | "Roles" | "Invitations" | "Projects">("General")

  return (
    <div className='flex max-w-screen-xl mx-auto bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-md my-10'>
      <div className='w-1/6 py-6 border-solid border-r-[1px] border-r-zinc-900'>
        {allPanels.map(settingsPanel => (
          <Button onClick={() => setPanel(settingsPanel)} className={`rounded-none w-full ${settingsPanel === panel ? "text-white border-solid border-l-[2px] border-l-orange-400" : "text-zinc-400"}`} variant="ghost" key={settingsPanel}>
            {settingsPanel}
          </Button>
        ))}
      </div>
      <div className='px-6 py-8 w-5/6'>
        {panel === "General" && <General company={company} currentMember={currentMember} />}
        {panel === "Roles" && <Roles company={company} currentMember={currentMember} />}
        {panel === "Invitations" && <Invitations company={company} currentMember={currentMember} />}
        {panel === "Projects" && <Projects company={company} currentMember={currentMember} />}
      </div>
    </div>
  )
}

function Roles({ company, currentMember }: SettingsProps) {
  if (currentMember.role !== "Admin") {
    return (
      <div>
        You don't have permission to view this panel
      </div>
    )
  }

  return (
    <div>
      <h2 className='font-semibold text-xl'>Roles Settings</h2>
      <p className='text-[15px] text-zinc-400 max-w-xl mt-1'>Manage member roles and permissions, ensure that each member has the appropiate access to the company</p>

      <div className='flex flex-col gap-y-4 mt-8'>
        {company.members.map(member => (
          <CompanyMember key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}

function General({ company, currentMember }: SettingsProps) {
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(company.name);
  const [description, setDescription] = useState<string>(company.description!);
  const [location, setLocation] = useState<string>(company.location || "");
  const [website, setWebsite] = useState<string>(company.website!)

  async function handleSaveChanges(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    await editCompany(company.id, { name, description, location, website })
      .catch(err => toast({
        title: 'Something went wrong',
        description: 'Please try again'
      })).finally(() => setLoading(false))
  }

  return (
    <div>
      <h2 className='font-semibold text-xl'>General Settings</h2>
      <p className='text-[15px] text-zinc-400 max-w-xl mt-1'>Customize your company, including its name, description, and other key details to accurately represent your organization</p>

      <form onSubmit={(e) => handleSaveChanges(e)}>
        <div className='my-3'>
          <Label htmlFor="name">Name</Label>
          <Input className='mt-1' value={name} onChange={(e) => setName(e.target.value)} id="name" disabled={currentMember.role === "Reader"} required />
        </div>
        <div className='my-3'>
          <Label htmlFor="description">Description</Label>
          <Textarea className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} id="description" disabled={currentMember.role === "Reader"} required />
        </div>
        <div className='my-3'>
          <Label htmlFor="location">Location</Label>
          <Input className='mt-1' value={location} onChange={(e) => setLocation(e.target.value)} id="location" disabled={currentMember.role === "Reader"} />
        </div>
        <div className='my-3'>
          <Label htmlFor="website">Website</Label>
          <Input className='mt-1' value={website} onChange={(e) => setWebsite(e.target.value)} id="website" disabled={currentMember.role === "Reader"} required />
        </div>

        <div className="flex justify-end">
          <Button disabled={loading || currentMember.role === "Reader"}>{loading ? "Saving changes..." : "Save changes"}</Button>
        </div>
      </form>

    </div>
  )
}

function Invitations({ currentMember, company }: SettingsProps) {
  const [invitations, setInvitations] = useState<Invitation[] | null>(null);

  useEffect(() => {
    getInvitations('company', company.id).then(setInvitations);
  }, [])

  async function handleDeleteInvitation(id: string) {
    setInvitations(invitations?.filter(inv => inv.id !== id)!)
    return await deleteInvitation(id)
  }

  return (
    <div>
      {invitations === null && <p>Loading invitations...</p>}
      {invitations?.length === 0 && <p>No pending invitations</p>}

      <div className="flex flex-col gap-6">
        {invitations?.filter(inv => inv.status === "Pending").map(invitation => (
          <div key={invitation.id}>
            <div className='flex gap-2 items-center'>
              <p className='text-zinc-300 text-[15px]'>{invitation.email}</p>
              <Badge>{invitation.role}</Badge>
            </div>
            <p className='text-zinc-200 mt-1'>{invitation.message}</p>
            <div className="flex gap-2 mt-1">
              <Button variant="destructive" size="sm" onClick={() => handleDeleteInvitation(invitation.id)} disabled={currentMember.role !== "Admin"}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

function Projects({ currentMember, company }: SettingsProps) {
  if (currentMember.role !== "Admin") {
    return (
      <div>
        You don't have access to this settings page :)
      </div>
    )
  }

  if (company?.projects.length === 0) {
    return (
      <div>
        No projects yet.
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-y-4'>
      {company.projects.map(project => (
        <Project project={project} key={project.id}/>
      ))}
    </div>
  )
}

function Project({ project }: { project: Project }) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState<string>(project.description || "");
  const [priority, setPriority] = useState(project.priority)
  
  async function handleSave() {
    setSaving(true);

    return await editProject({ projectId: project.id, data: { title, description, priority }}).then((p) => router.push(`/dashboard/${project.companyId}/${p.title}`)).finally(() => setSaving(false));
  }

  async function handleDelete() {
    setDeleting(true);

    return await deleteProject({ projectId: project.id }).finally(() => router.push(`/dashboard/${project.companyId}`))
  }

  return (
    <div className={`bg-zinc-925 p-4 rounded-md border-solid border-zinc-800 border-[1px] ${deleting && "pointer-events-none opacity-70"}`}>
      <h5 className='font-semibold'>{project.title} {project.managerId && <Badge>Has manager</Badge>}</h5>
      <p className={`text-[15px] text-zinc-400 ${project.managerId && "mt-1"}`}>{project.description}</p>
      <div className="flex justify-end gap-1">
        <Button variant="destructive" disabled={deleting} onClick={handleDelete}>Delete</Button>
        <Dialog>
          <DialogTrigger className='border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium'>
            Edit
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit project</DialogTitle>
              <DialogDescription>Press save when you're done.</DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="title">Title:</Label>
              <Input id="title" className='mt-1' placeholder='Project name' value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description:</Label>
              <Textarea id="description" className='mt-1' value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='priority'>Priority</Label>
              <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue aria-label={priority}>
                    {priority}
                  </SelectValue>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value='High'>High</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={saving || deleting}>{saving ? "Saving..." : 'Save'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}