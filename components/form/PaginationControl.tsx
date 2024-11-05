import {ArrowLeftIcon, ArrowRightIcon} from "@radix-ui/react-icons"
import Link from "next/link"
import React from "react"

type PaginationControlProps = {
  previousPath: string
  nextPath: string
  page: number
}

const btnStyles =
  "text-primary bg-white/5 opacity-75 flex justify-center items-center gap-x-2 hover:opacity-100 transition text-sm duration-500"

export default function PaginationControl({
  previousPath,
  page,
  nextPath,
}: PaginationControlProps) {
  return (
    <section className="flex justify-between w-full">
      {previousPath ? (
        <Link href={previousPath} className={btnStyles}>
          <ArrowLeftIcon /> Previous
        </Link>
      ) : (
        <div />
      )}

      <span>Page: {page}</span>

      {nextPath && (
        <Link href={nextPath} className={btnStyles}>
          Next
          <ArrowRightIcon />
        </Link>
      )}
    </section>
  )
}
