"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { GanttChartSquare, Users2, CheckCircle2, Settings } from 'lucide-react';

import { Button } from '../ui/button'

export default function Menu() {
  const path = usePathname();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<string>("");

  useEffect(() => {
    router.push(`${path}?tab=${selectedTab}`)
  }, [selectedTab]);

  return (
    <div className="flex overflow-x-auto gap-1 bg-zinc-950 border-solid border-b-[1px] border-b-zinc-800 px-1 md:px-4">
      <Button className={`text-zinc-400 text-[14px] md:text-sm hover:bg-transparent ${selectedTab === "" && "border-solid border-b-2 border-b-orange-400 text-zinc-50 rounded-b-none"}`} variant={selectedTab === "" ? "ghost" : "ghost"} onClick={() => setSelectedTab("")}><GanttChartSquare size={18} className='mr-2' />Overview</Button>
      <Button className={`text-zinc-400 text-[14px] md:text-sm hover:bg-transparent ${selectedTab === "members" && "border-solid border-b-2 border-b-orange-400 text-zinc-50 rounded-b-none"}`} variant="ghost" onClick={() => setSelectedTab("members")}><Users2 size={18} className='mr-2' />Members</Button>
      <Button className={`text-zinc-400 text-[14px] md:text-sm hover:bg-transparent ${selectedTab === "tasks" && "border-solid border-b-2 border-b-orange-400 text-zinc-50 rounded-b-none"}`} variant="ghost" onClick={() => setSelectedTab("tasks")}><CheckCircle2 size={18} className='mr-2' />Tasks</Button>
      <Button className={`text-zinc-400 text-[14px] md:text-sm hover:bg-transparent ${selectedTab === "settings" && "border-solid border-b-2 border-b-orange-400 text-zinc-50 rounded-b-none"}`} variant="ghost" onClick={() => setSelectedTab("settings")}><Settings size={18} className='mr-2' />Settings</Button>
    </div>
  )
}
