import React from "react"
import {FaStar} from "react-icons/fa"

export default function ProductRating({productId}: {productId: string}) {
  const rating = 4.5
  const count = 25

  const className = "flex gap-1 items-center text-md mt-1 mb-4"
  const countValue = `(${count}) reviews`
  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {rating} {countValue}
    </span>
  )
}