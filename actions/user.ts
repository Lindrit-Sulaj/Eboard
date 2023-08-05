"use server"
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt"

import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";


export async function getSession() {
  return await getServerSession(options)
}

export async function getUser() {
  const session = await getSession();

  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    },
    include: {
      members: true
    }
  });

  if (!user) throw new Error(`The user with ${session?.user.email} couldn't be found in the database`);

  return user;
}

export async function signUpUser({ name, email, password, image }: { name: string, email: string, password: string, image?: string }) {
  const session = await getSession();

  if (session?.user) throw new Error("Cannot create new account, when already logged in");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      hashedPassword,
      email,
      image
    }
  });

  return user;
}

export async function updateUser(data : { name?: string, password?: string }) {
  const session = await getSession();
  let updatedData: { name?: string, hashedPassword?: string } = {}
  
  if (data.name) {
    updatedData.name = data.name
  };

  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    updatedData.hashedPassword = hashedPassword;
  }

  return await prisma.user.update({
    where: {
      email: session?.user?.email!
    },
    data: {
      ...updatedData
    }
  })
}