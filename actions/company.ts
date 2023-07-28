"use server"
import { getUser } from "./user"
import { createMember } from "./member";
import { Industry } from "@/ts/data";
import prisma from "@/lib/prisma";

export async function createCompany(data: { name: string, industry: any, description: string, website: string}) {
  const user = await getUser();

  if (!user) throw new Error("You must be signed in to create a company");

  const industries = Object.entries(Industry);
  var companyIndustry: any;

  for (let industry of industries) {
    if (industry[1] === data.industry) {
      companyIndustry = industry[0]
    }
  }

  const company = await prisma.company.create({
    data: {
      ...data,
      industry: companyIndustry
    }
  });

  const member = await createMember(company.id, user, "Admin")

  if (!member) throw new Error("Something went wrong")

  return company;
}