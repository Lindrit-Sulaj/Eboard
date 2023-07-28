import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { industriesArray } from '@/ts/data'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'

export default function CreateCompany() {
  return (
    <main>
      <div className='bg-zinc-950 pt-10 pb-14 md:pt-20 md:pb-28 border-solid border-b-[1px] border-b-zinc-800 px-4'>
        <div className="max-w-screen-xl mx-auto">
          <h1 className='font-semibold text-2xl md:text-4xl'>Create a New Company</h1>
          <p className='mt-1 text-zinc-400 text-sm md:text-base'>Seamlessly set up your company, define roles, and manage projects with ease.</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row max-w-screen-xl gap-6 mx-auto -mt-10 md:-mt-14 px-4 xl:px-0 pb-4">
        <Card className="bg-zinc-950 md:p-4 w-full lg:w-2/3 border-solid border-[1px] border-zinc-800">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Enter your company details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex mb-3 gap-3'>
              <div className='w-1/2'>
                <Label htmlFor='name'>Name</Label>
                <Input placeholder='Enter your company name' id="name" type="text" className='mt-1' />
              </div>
              <div className='w-1/2'>
                <Label htmlFor='industry'>Industry</Label>
                <Select>
                  <SelectTrigger className='mt-1'>
                    <SelectValue placeholder="Choose Industry" />
                  </SelectTrigger>
                  <SelectContent className='h-[320px] overflow-y-auto'>
                    {industriesArray.map(industry => (
                      <SelectItem value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="my-3">
              <Label htmlFor="website">Website *</Label>
              <Input placeholder='Enter your company website (optional)' id="website" className='mt-1' />
            </div>
            <div className="my-3">
              <Label htmlFor='description'>Description *</Label>
              <Textarea className='mt-1' placeholder='Describe your company (optional)' />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
            <Link href="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button>Create company</Button>
          </CardFooter>
        </Card>
        <div className="w-full lg:w-1/3 rounded-lg text-zinc-950 shadow-sm lg:flex flex-col dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 bg-zinc-950 p-6 md:p-10 border-solid border-[1px] border-zinc-800">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Friends</h3>
          <p className='text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-2'>Invite your friends to your company</p>
          <Button className='mt-auto' variant="secondary">Coming soon</Button>
        </div>
      </div>
    </main>
  )
}
