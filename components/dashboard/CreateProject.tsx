"use client"
import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export default function CreateProject() {
  const [priority, setPriority] = useState('Medium');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>Create a new project to organize tasks, collaborate with your team, and drive your business forward.</DialogDescription>
        </DialogHeader>
        <form action="">
          <div className="my-2">
            <Label htmlFor="name">Name:</Label>
            <Input className='mt-1' id="name" name="name" placeholder='Enter project name' />
          </div>
          <div className="my-2">
            <Label htmlFor="description">Description</Label>
            <Textarea className='mt-1' id="description" name="description" placeholder='Enter project description' />
          </div>
          <div className="my-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className='mt-1' id="priority">
                <SelectValue>
                  { priority }
                </SelectValue>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
