"use client"

import {usePathname} from "next/navigation"
import FormContainer from "../form/FormContainer"
import {toggleFavoriteAction} from "@/utils/actions"
import {CardSubmitButton} from "../form/Button"

type FavoriteToggleFormProps = {
  productId: string
  favoriteId: string | null
}

export default function FavoriteToggleForm({
  productId,
  favoriteId,
}: FavoriteToggleFormProps) {
  const pathname = usePathname()

  const toggleAction = toggleFavoriteAction.bind(null, {
    productId,
    favoriteId,
    pathname,
  })

  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavorite={favoriteId ? true : false} />
    </FormContainer>
  )
}