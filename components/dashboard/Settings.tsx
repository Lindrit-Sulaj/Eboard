"use client"

import React, { useState } from 'react'
import { Company, Member } from '@prisma/client'

import { editCompany } from '@/actions/company';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface SettingsProps {
  company: Company;
  currentMember: Member;
}

const allPanels: ["General", "Members", "Invitations", "Projects"] = ["General", "Members", "Invitations", "Projects"]

export default function Settings({ company, currentMember }: SettingsProps) {
  const [panel, setPanel] = useState<"General" | "Members" | "Invitations" | "Projects">("General")

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
          <Input className='mt-1' value={name} onChange={(e) => setName(e.target.value)} id="name" required />
        </div>
        <div className='my-3'>
          <Label htmlFor="description">Description</Label>
          <Textarea className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} id="description" required />
        </div>
        <div className='my-3'>
          <Label htmlFor="location">Location</Label>
          <Input className='mt-1' value={location} onChange={(e) => setLocation(e.target.value)} id="location" />
        </div>
        <div className='my-3'>
          <Label htmlFor="website">Website</Label>
          <Input className='mt-1' value={website} onChange={(e) => setWebsite(e.target.value)} id="website" required />
        </div>

        <div className="flex justify-end">
          <Button>{loading ? "Saving changes" : "Save changes"}</Button>
        </div>
      </form>

    </div>
  )
}
