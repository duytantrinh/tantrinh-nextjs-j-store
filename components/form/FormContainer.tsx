"use client"

import {useFormState} from "react-dom"
import React, {useActionState, useEffect} from "react"
import {useToast} from "@/hooks/use-toast"
import {actionFunction} from "@/utils/types"

const initialState = {
  message: "",
}

export default function FormContainer({
  action,
  children,
}: {
  action: actionFunction
  children: React.ReactNode
}) {
  const [state, formAction] = useFormState(action, initialState)
  const {toast} = useToast()

  useEffect(() => {
    if (state.message) {
      if (state.message.includes("successfully")) {
        toast({description: state.message, variant: "success"})
      } else {
        toast({description: state.message, variant: "destructive"})
      }
    }
  }, [state, toast])

  return <form action={formAction}>{children}</form>
}
