"use client"
import {adminLinks} from "@/utils/link"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {Button} from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside>
      {adminLinks.map((link) => {
        const isActivePage = pathname === link.href
        const variant = isActivePage ? "default" : "ghost"

        return (
          <Button
            asChild
            className="w-full mb-2 capitalize font-normal justify-start"
            variant={variant}
            key={link.href}
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        )
      })}
    </aside>
  )
}