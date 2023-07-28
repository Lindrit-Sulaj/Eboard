"use server"
import type { User } from "@prisma/client";

import { getUser } from "./user";
import prisma from "@/lib/prisma";

export async function getMember(companyId: string) {
  const user = await getUser();

  if (!user) return null;

  return user.members.filter(member => member.companyId === companyId)
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