"use client"

import {useToast} from "@/hooks/use-toast"
import {SignOutButton} from "@clerk/nextjs"
import Link from "next/link"

export default function SignOutLink() {
  const {toast} = useToast()

  const handleLogout = () => {
    toast({description: "Logout Successful", variant: "success"})
  }
  return (
    <SignOutButton>
      <Link href="/" className="w-full text-left" onClick={handleLogout}>
        {" "}
        Logout
      </Link>
    </SignOutButton>
  )
}
