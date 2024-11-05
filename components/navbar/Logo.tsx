import Link from "next/link"
import {Button} from "../ui/button"

import {BiSolidStore} from "react-icons/bi"

export default function Logo() {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <BiSolidStore className="w-6 h-6" />
      </Link>
    </Button>
  )
}
