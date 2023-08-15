"use server"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { getCompany } from "./company"

export async function createInvitation(data: { email: string, companyId: string, senderName: string, role: Role, message?: string }) {
  const company = await getCompany(data.companyId)
  const memberExists = company?.members.find(member => member.email === data.email);

  if (memberExists) {
    return 'User already is a member'
  }

  return await prisma.invitation.create({
    data: {
      ...data
    }
  })
}

export async function getInvitations(by: 'user' | 'company', val: string) {
  return await prisma.invitation.findMany({
    where: {
      ...(by === "user" ? { email: val } : { companyId: val })
    },
    include: {
      company: true
    }
  })
}