"use server"
import prisma from "@/lib/prisma"
import { InvitationStatus, Role } from "@prisma/client"
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
  if (by === "user") {
    return await prisma.invitation.findMany({
      where: {
        email: val,
      },
      include: {
        company: true
      },
      orderBy: { createdAt: 'asc' }
    })
  }
  
  return await prisma.invitation.findMany({
    where: {
      companyId: val
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}

export async function changeInvitationStatus(id: string, status: InvitationStatus) {
  return await prisma.invitation.update({
    where: {
      id
    },
    data: {
      status
    }
  })
}

export async function deleteInvitation(id: string) {
  return await prisma.invitation.delete({
    where: { id }
  })
}