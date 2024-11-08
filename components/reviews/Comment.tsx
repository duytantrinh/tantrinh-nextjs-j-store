"use client"

import {useState} from "react"
import {Button} from "../ui/button"

export default function Comment({comment}: {comment: string}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const longComment = comment.length > 130

  const displayComment =
    longComment && !isExpanded ? `${comment.slice(0, 130)}...` : comment

  return (
    <div className="px-6">
      <p className="text-sm">{displayComment}</p>
      {longComment && (
        <Button
          variant="link"
          className="pl-0 text-muted-foreground"
          onClick={toggleExpanded}
        >
          {isExpanded ? "show less" : "show more"}
        </Button>
      )}
    </div>
  )
}
