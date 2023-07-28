import React from 'react'
import Menu from '@/components/dashboard/Menu'
import { getMember } from '@/actions/member'

export default async function CompanyPage({ params, searchParams }: { params: {[key:string]: string}, searchParams: { [key:string]: string } }) {
  const member = await getMember(params.companyId)

  return (
    <main>
      <Menu />
    </main>
  )
}
