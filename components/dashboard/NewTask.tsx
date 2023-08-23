"use client"
import React from 'react'
import { Project } from '@prisma/client'

import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

export default function NewTask({ project }: { project: Project }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className='rounded-l-none'>
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>Press save when you're done.</DialogDescription>
        </DialogHeader>

        <form>
          <div className="my-2">
            <Label htmlFor='title'>Title</Label>
            <Input id="title" placeholder='E.g. Finish exterior of main building' className='mt-1' />
          </div>
          <div className="my-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder='Complete the exterior finishing of the main building according to design and quality standards... ' className='mt-1' />
          </div>
          <div className="my-2">
            <Label htmlFor="assignee">Assign member</Label>
            <Select>
              <SelectTrigger id="assignee" className='mt-1'>
                <SelectValue placeholder='None' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dave">Dave</SelectItem>
                <SelectItem value="John">John</SelectItem>
                <SelectItem value="Jane">Jane</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-2">
            <Label htmlFor="label">Label</Label>
            <Select>
              <SelectTrigger id="label" className='mt-1'>
                <SelectValue placeholder='Choose label' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
