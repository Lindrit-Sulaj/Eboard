"use server"
import prisma from "@/lib/prisma"

export async function createTask() {
  return await prisma.task.create({
    data: {
      title: 'My first task',
      projectId: '64c196707301a909b3655cef',
    }
  })
}