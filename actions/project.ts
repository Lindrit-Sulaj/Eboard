"use server"
import { Priority } from "@prisma/client"
import prisma from "@/lib/prisma"

export async function createProject({ companyId, title, priority, managerId, description }:
  { companyId: string, title: string, priority: Priority, managerId: string, description?: string }) {

  const projectWithNameExists = await prisma.project.findMany({
    where: {
      companyId,
      title
    }
  })

  if (projectWithNameExists[0]) throw new Error("Project already exists")

  return await prisma.project.create({
    data: {
      companyId,
      title,
      priority,
      description,
      ...(managerId && { managerId })
    }
  })
}

export async function getProject({ companyId, projectName }: { companyId: string, projectName: string }) {
  return await prisma.project.findFirst({
    where: {
      companyId,
      title: projectName
    },
    include: {
      tasks: true
    }
  })
}