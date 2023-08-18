"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { type Task, type Member, type Company, Invitation } from '@prisma/client';
import { Info, MoreVertical, X, Layout, Hourglass, Users2, Bell, Pin, Mail, CheckCircle2, Link as LucideLink, Plus, Check } from 'lucide-react';
import Link from 'next/link';

import { getTasks, editTask } from '@/actions/task';
import { getUserMembers, createMember } from '@/actions/member';
import { getInvitations, changeInvitationStatus } from '@/actions/invite';

import { Industry } from '@/ts/data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import UserSettings from '@/components/UserSettings';

interface InvitationInterface extends Invitation {
  company: Company
}

export default function DashboardPage() {
  const user = useAuth();
  const session = useSession();
  const router = useRouter();

  const [invitations, setInvitations] = useState<InvitationInterface[] | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [members, setMembers] = useState<any>(null);
  const [searchCompanies, setSearchCompanies] = useState("")

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push('/signup')
    }
  }, [session])


  useEffect(() => {
    async function fetchTasks() {
      return await getTasks("user").then(setTasks);
    }

    async function fetchMembers() {
      return await getUserMembers(user?.id!).then(setMembers)
    }

    async function fetchInvitations() {
      return await getInvitations('user', user?.email!).then(setInvitations);
    }

    fetchInvitations();
    fetchMembers();
    fetchTasks();
  }, [])

  async function handleAcceptInvitation({ invitationId, companyId, role }: { invitationId: string, role: string, companyId: string }) {
    await changeInvitationStatus(invitationId, 'Accepted');
    // @ts-ignore
    await createMember(companyId, user, role)

    return router.push(`/dashboard/${companyId}/`)
  }

  return (
    <main className='px-4'>
      <Tabs defaultValue="overview" className='max-w-screen-xl mx-auto'>
        <TabsList className='border-solid my-4 border-b-[1px] border-b-zinc-800'>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value='companies'>Companies</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="flex justify-between items-center bg-neutral-950 border-zinc-800 border-solid border-[1px] rounded-md p-6">
            <div className="flex gap-4 items-center">
              {user?.image && <img className='w-12 h-12 rounded-full' src={user?.image} alt={user?.name!} />}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold leading-none tracking-tight">{user?.name}</h2>
                <p className="text-sm text-zinc-400 mt-1">{user?.email}</p>
              </div>
            </div>

            <Button onClick={() => signOut()}>Log out</Button>
          </div>
          <div className="flex items-start gap-4 mt-4 h-full">
            <div className="w-2/3 bg-zinc-950 border-solid border-[1px] rounded-md border-zinc-800 h-full">
              {!tasks && [1, 2, 3, 4, 5, 6, 7].map((elem, index) => (
                <div key={index}>
                  <div className='p-4 flex items-center justify-between'>
                    <div className='w-full'>
                      <Skeleton className='w-[60px] h-3' />
                      <Skeleton className='w-1/3 h-5 mt-2' />
                      <Skeleton className='w-3/5 h-3 mt-1' />
                    </div>
                    <div className="flex gap-1 items-center">
                      <Skeleton className='w-[58px] h-[20px] rounded-full' />
                      <Skeleton className='w-[13px] h-[28px]' />
                    </div>
                  </div>
                  <Separator className='dark:bg-zinc-900' />
                </div>
              ))}
              {tasks?.length! > 0 && tasks?.map(task => (
                <Task key={task.id} task={task} />
              ))}
              {tasks?.length === 0 && (
                <div className="p-4">
                  <p className='text-sm text-zinc-400'>No tasks assigned to you yet</p>
                </div>
              )}
            </div>
            <div className="w-1/3">
              <div className='bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-md'>
                <h3 className='font-semibold text-xl flex items-center px-4 pt-4 pb-3'>
                  <Bell size={20} className='mr-2' />
                  Notifications
                  <Badge className='dark:bg-blue-500 ml-2'>Coming soon</Badge>
                </h3>
                <Separator className='dark:bg-zinc-900' />
                <div>
                  <div className='notification p-4'>
                    <div className="notification-icon flex gap-1 items-center">
                      <Pin size={16} className='text-orange-300' /> <span className='text-sm text-zinc-400'>(2 minutes ago)</span>
                    </div>
                    <div className="notification-body mt-1">
                      <h4 className='font-medium'>
                        Task Assigned
                      </h4>
                      <p className='text-sm text-zinc-400'>You have been assigned to a new task "Update main branch"</p>
                    </div>
                  </div>
                  <div className='notification p-4'>
                    <div className="notification-icon flex gap-1 items-center">
                      <Mail size={16} className='text-orange-300' /> <span className='text-sm text-zinc-400'>(2 minutes ago)</span>
                    </div>
                    <div className="notification-body mt-1">
                      <h4 className='font-medium'>
                        New invitation
                      </h4>
                      <p className='text-sm text-zinc-400'>You have received an invitation to join Twitter.</p>
                    </div>
                  </div>
                  <div className='notification p-4'>
                    <div className="notification-icon flex gap-1 items-center">
                      <CheckCircle2 size={16} className='text-orange-300' /> <span className='text-sm text-zinc-400'>(2 minutes ago)</span>
                    </div>
                    <div className="notification-body mt-1">
                      <h4 className='font-medium'>
                        Success
                      </h4>
                      <p className='text-sm text-zinc-400'>Notifications feature has been completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </TabsContent>
        <TabsContent value="companies">
          <div className="search mb-3 flex gap-2">
            <Input placeholder='Search for companies' value={searchCompanies} onChange={(e) => setSearchCompanies(e.target.value)} className='grow' />
            <Link href="/company/new">
              <Button className='whitespace-nowrap'> Add new <Plus className='ml-1 hidden md:block' size={16} /></Button>
            </Link>
          </div>
          {members && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {members.filter((m: any) => m.company.name.toLowerCase().includes(searchCompanies.toLowerCase())).map((member: any) => (
                <div className='p-4 bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-md flex flex-col' key={member.id}>
                  <div className="heading mb-3">
                    <h3 className='font-semibold'>
                      <Link href={`/dashboard/${member.company.id}/`}>{member.company.name} </Link>
                      <span className='font-medium text-zinc-400 text-sm ml-1'>{Industry[member.company.industry as keyof typeof Industry]}</span>
                    </h3>

                    <a className='text-zinc-400 text-sm flex gap-1 items-center mt-1 underline underline-offset-2 hover:text-white' href={member.company.website}><LucideLink size={14} /> {member.company.website}</a>
                  </div>

                  <div className="description mt-auto">
                    <p className='text-zinc-300 text-sm'>{member.company.description}</p>
                    <Badge className={`${(member.role === "Admin") ? "dark:bg-blue-500" : "bg-white"}`}>{member.role}</Badge>
                  </div>

                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="invitations">
          {invitations === null && <p>Loading</p>}
          {invitations?.length === 0 && <p>You have no pending invites</p>}

          {invitations?.map(invitation => (
            <div key={invitation.id} className='bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-md px-6 py-4 flex justify-between gap-2'>
              <div className='flex flex-col'>
                <h3 className='font-semibold'>{invitation.company.name} <span className="text-zinc-400 text-[14px] ml-1">{Industry[invitation.company.industry]}</span></h3>
                {invitation.message && <p className='text-[15px] text-zinc-300 my-1'>{invitation.message}</p>}

                <div className='mt-auto text-[15px] flex items-center gap-2'>By {invitation.senderName} <Badge>Admin</Badge></div>
              </div>
              <div className='flex flex-col gap-2 items-center'>
                <Button className='dark:bg-transparent dark:hover:bg-red-500' size="icon">
                  <X className='text-white' />
                </Button>
                <Button onClick={() => handleAcceptInvitation({ invitationId: invitation.id, role: invitation.role, companyId: invitation.companyId })} className='dark:bg-transparent dark:hover:bg-green-500' size="icon">
                  <Check className='text-white' />
                </Button>
              </div>

            </div>
          ))}

          <pre>
            {JSON.stringify(invitations, null, 2)}
          </pre>
        </TabsContent>
        <TabsContent value="settings">
          <UserSettings />
        </TabsContent>
      </Tabs>
    </main >
  )
}

function Task({ task }: { task: Task }) {
  const [status, setStatus] = useState<string>(task.status)

  useEffect(() => {
    async function edit() {
      await editTask(task.id, { status: (status === "In progress" ? "In_progress" : status) })
    };

    edit();
  }, [status])

  return (
    <>
      <div className='p-4 flex items-center gap-3 justify-between'>
        <div>
          <p className={`flex gap-1 items-center text-sm ${status === "Completed" ? "text-green-400" : (status === "Todo") ? "text-orange-400" : "text-purple-300"}`}>
            <Info size={14} /> {status === "In_progress" ? "In progress" : status}
          </p>
          <h4>
            <Link href="/" className='hover:underline hover:underline-offset-2'>
              {task.title}
            </Link>
          </h4>
          {task.description && <p className='text-zinc-400 text-sm max-w-lg'>{task.description}</p>}
        </div>

        <div className="flex gap-1">
          <Badge variant="secondary">{task.priority}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='w-36'><Users2 className='w-4 h-4 mr-2' /> Company </DropdownMenuItem>
              <DropdownMenuItem className='w-36'><Layout className='w-4 h-4 mr-2' /> View </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Hourglass className='h-4 w-4 mr-2' /> Mark as
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                      <DropdownMenuRadioItem value="In progress">In progress</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Todo">Todo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Completed">Completed</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='w-36'><X className='w-4 h-4 mr-2' />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
      <Separator className='dark:bg-zinc-900' />
    </>
  )
}