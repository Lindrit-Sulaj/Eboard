"use client"
import { Member } from '@prisma/client'
import React, { useState, useEffect, useRef } from 'react'
import { Ban, MoreVertical } from 'lucide-react'

import { useAuth } from '@/app/AuthProvider'
import { editMember, removeMember } from '@/actions/member'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from '../ui/dropdown-menu'
import { Badge } from '../ui/badge'
import { useToast } from '../ui/use-toast'

export default function CompanyMember({ member }: { member: Member }) {
  const user = useAuth();
  const { toast } = useToast();
  const isMounted = useRef(false);
  const [role, setRole] = useState<string>(member.role);

  async function handleRemoveMember() {
    console.log("Running `Delete Member`")

    return await removeMember(member.id).finally(() => {
      return toast({
        title: "Member has been kicked",
        description: "Please refresh the page to view the new members list"
      })
    });
  }

  useEffect(() => {
    async function handleRoleChange() {
      if (!["Admin", "Editor", "Reader"].includes(role)) return;
      if (member.userId === user?.id) return;

      // @ts-ignore
      return await editMember(member.id, { role })
    }

    if (isMounted.current) {
      handleRoleChange();

      console.log("Role changed")
    } else {
      isMounted.current = true
    }
  }, [role])

  return (
    <div key={member.id} className='flex justify-between items-center'>
      <div className="flex items-center gap-2">
        {member.image && <img className='w-10 h-10 rounded-full' src={member.image} alt={member.name} />}
        <div>
          <h6 className='font-semibold'>{member.name}</h6>
          <p className='text-sm text-zinc-400'>{member.email}</p>
        </div>
      </div>
      {member.userId !== user?.id && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                    <DropdownMenuRadioItem value="Reader">Reader</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Editor">Editor</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Admin" disabled>Admin</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={handleRemoveMember} className='text-red-400'><Ban size={14} className='mr-2' /> Kick</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {member.userId === user?.id && (
        <Badge>You</Badge>
      )}
    </div>
  )
}
