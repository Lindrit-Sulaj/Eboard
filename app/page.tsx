import { getSession } from "@/actions/user"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex justify-center flex-col items-center h-[calc(100vh-67px)]">
        <p className="font-semibold mb-2">eboard</p>
        <h1 className="font-bold text-2xl md:text-4xl">You must sign in to continue</h1>
        <p className="text-sm md:text-[15px] max-w-md text-center mt-2 text-zinc-400">Create an account or log in, in order to use eboard's free services for managing your businesses online</p>
        <div className="flex gap-2 mt-3">
          <Link href="/signup">
            <Button variant="outline" className="dark:bg-zinc-925">Create account</Button>
          </Link>
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex justify-center flex-col items-center h-[calc(100vh-67px)]">
      <p className="font-semibold mb-2">eboard</p>
      <h1 className="font-bold text-2xl md:text-4xl">Welcome {session.user?.name ? session.user?.name : session.user?.email}</h1>
      <p className="text-sm md:text-[15px] max-w-md text-center mt-2 text-zinc-400">Go to dashboard to view your companies</p>
      <Link href="/dashboard" className="block mt-2">
        <Button>Go to dashboard</Button>
      </Link>
    </main>
  )
}
