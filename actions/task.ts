"use server"
import prisma from "@/lib/prisma"
import { getUser } from "./user"

export async function createTask() {
  return await prisma.task.create({
    data: {
      title: 'My first task',
      projectId: '64c196707301a909b3655cef',
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