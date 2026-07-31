"use client"

import { useSession, signOut } from "next-auth/react"

export function ProfileButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-zinc-600">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Welcome, </span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{session.user?.name}</span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/Login" })}
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Sign Out
      </button>
    </div>
  )
}