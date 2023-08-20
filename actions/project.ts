"use server"
import { Priority } from "@prisma/client"
import prisma from "@/lib/prisma"


export async function createProject({ companyId, title, priority, managerId, description }:
  { companyId: string, title: string, priority: Priority, managerId: string, description?: string }) {

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