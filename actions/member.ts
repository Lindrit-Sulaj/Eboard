"use server"
import type { User, Role } from "@prisma/client";

import { getUser } from "./user";
import prisma from "@/lib/prisma";

export async function getMember(companyId: string) {
  const user = await getUser();

  if (!user) return null;

  return user.members.find(member => member.companyId === companyId)
}

export async function createMember(companyId: string, user: User, role: "Reader" | "Editor" | "Admin", otherMembers?: any) {
  return await prisma.member.createMany({
    data: [
      {
        userId: user.id,
        companyId: companyId,
        name: user.name!,
        email: user.email!,
        image: user.image,
        role
      }
    ]
  })
}

export async function getUserMembers(userId: string) {
  return await prisma.member.findMany({
    where: {
      userId: userId
    },
    include: {
      company: true
    }
  })
}

export async function editMember(memberId: string, data: { role?: Role, name?: string, image?: string  } = {}) {
  return await prisma.member.update({
    where: {
      id: memberId
    },
    data: {
      ...data
    }
  })
}

export async function removeMember(memberId: string) {
  return await prisma.member.delete({
    where: {
      id: memberId
    }
  })
}