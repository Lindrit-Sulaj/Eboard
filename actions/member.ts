"use server"
import { getUser } from "./user";

export async function getMember(companyId: string) {
  const user = await getUser();
  
  if (!user) return null;

  return user.members.filter(member => member.companyId === companyId)
}