import React from 'react'
import { getMember } from '@/actions/member'

export default async function CompanyLayout({ children, params }: { children: React.ReactNode, params: { [key:string]: string } }) {
  const member = await getMember(params.companyId);

  if (!member) {
    return (
      <main>
        You are not authorized to view this page
      </main>
    )
  }
  
  return (
    <>
      { children }
    </>
  )
}
