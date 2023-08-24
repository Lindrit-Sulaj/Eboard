"use server"
import { Label, Priority } from "@prisma/client"
import prisma from "@/lib/prisma"
import { getUser } from "./user"

export async function createTask(data: { title: string, projectId: string, priority: Priority, label: Label | null, description: string | null}) {
  return await prisma.task.create({
    data: {
      ...data
    }
  })
}

type By = "user" | "company"

export async function getTasks(by: By, id?: string) {
  const user = await getUser();

  let where: {
    assigneeId?: string,
    companyId?: string
  } = {};

  if (by === "user") {
    where.assigneeId = user?.id!
  } else if (by === "company") {
    where.companyId = id
  }

  return await prisma.task.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })
}

export async function editTask(taskId: string, data: any) {
  return await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      ...data
    }
  })
}

export async function deleteTask(taskId: string) {
  return await prisma.task.delete({
    where: {
      id: taskId
    }
  })
}