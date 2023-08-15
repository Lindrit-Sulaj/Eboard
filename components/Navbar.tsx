"use client"
import React, { useMemo } from 'react'
import {
  Menu,
  Settings,
  Users2,
  LogOut,
  CheckSquare,
  Gem
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { useAuth } from '@/app/AuthProvider'
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogContent,
} from './ui/alert-dialog';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const paths: string[] = [
  "/company/join",
  "/",
  "/dashboard/:id/invite",
]

export default function Navbar() {
  const user = useAuth();
  const path = usePathname();

  let hasImage;

  if (user) {
    hasImage = user.image !== "" && user.image !== null
  }


  async function handleLogOut() {
    await signOut();
  }

  const bottomBorder = useMemo(() => {
    let borderExists: boolean = false

    function dynamicRoute(dynamicPath: string): boolean {
      let routeMatches: boolean = true;

      let pages = dynamicPath.split("/").splice(1);
      let pathArray = path.split('/').splice(1)

      for (let i = 0; i < pages.length; i++) {
        if (pages[i] === pathArray[i]) {
          continue
        } else if (!pages[i].includes(":") && pages[i] !== pathArray[i]) {
          routeMatches = false;
        }
      };

      return routeMatches;
    }

    for (let pathWithBorder of paths) {
      if (pathWithBorder === path) {
        borderExists = true
      } else if (pathWithBorder.includes(':') && dynamicRoute(pathWithBorder)) {
        borderExists = true
      }
    };

    return borderExists
  }, [path])

  return (
    <nav className={`bg-neutral-950 flex justify-between items-center px-6 h-[67px] ${bottomBorder && "border-solid border-b-[1px] border-b-neutral-800"}`}>
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="right">
            {user ? (
              <>
                <Link href="/">
                  <Button className='w-full mt-6 mb-2' variant="outline">Join company</Button>
                </Link>
                <Link href="/company/new">
                  <Button className='w-full my-2'>New Company</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="outline" className='w-full mt-6 mb-2'>
                    Sign up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className='w-full my-2'>
                    Log in
                  </Button>
                </Link>
              </>
            )}

          </SheetContent>
        </Sheet>
        <h2 className='font-semibold text-lg'><Link href="/">eboard</Link></h2>
      </div>

      {user && (
        <div className='flex items-center gap-2'>
          <Link href="/">
            <Button className='hidden lg:block' variant="outline">Join Company</Button>
          </Link>
          <Link href="/company/new">
            <Button className='hidden lg:block'>New Company</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {hasImage ? <img className='w-8 h-8 rounded-full' src={user.image!} /> : <p className='px-2 py-1 rounded-md bg-zinc-800'>{user.name}</p>}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='pr-8'>
                <Settings className='w-4 h-4 mr-2' />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='pr-8'>
                <Users2 className='w-4 h-4 mr-2' />
                <span>Companies</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='pr-8'>
                <CheckSquare className='w-4 h-4 mr-2' />
                <span>Tasks</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='pr-8' disabled>
                <Gem className='w-4 h-4 mr-2' />
                <span>Upgrade</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog>
            <AlertDialogTrigger className='px-2'>
              <LogOut className='w-5 h-5' />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are your sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>Logging out will end your current session, and you will need to sign in again to access your account and projects. Any unsaved changes may be lost.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogOut}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {!user && (
        <div className='flex gap-2'>
          <Link href="/signup">
            <Button variant="outline">
              Sign up
            </Button>
          </Link>
          <Link href="/login">
            <Button>
              Log in
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}


