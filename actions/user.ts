"use server"
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";


async function getSession() {
  return await getServerSession(options)
}

export async function getUser() {
  const session = await getSession();

  if (!session?.user) throw new Error("No user is signed in");

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  });

  if (!user) throw new Error(`The user with ${session?.user.email} couldn't be found in the database`);

  return user;
}