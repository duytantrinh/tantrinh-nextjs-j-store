"use client"
import {useState} from "react"
import SelectProductAmount from "../single-product/SelectProductAmount"
import {Mode} from "../single-product/SelectProductAmount"
import FormContainer from "../form/FormContainer"
import {SubmitButton} from "../form/Button"
import {removeCartItemAction, updateCartItemAction} from "@/utils/actions"
import {useToast} from "@/hooks/use-toast"

function ThirdColumn({quantity, id}: {quantity: number; id: string}) {
  // initialState is the quantity which user selected at single page
  const [amount, setAmount] = useState(quantity)

  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()
  const handleAmountChange = async (value: number) => {
    setIsLoading(true)
    toast({description: "Calculating...", variant: "destructive"})
    const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    })
    setAmount(value)
    toast({description: result.message, variant: "success"})
    setIsLoading(false)
  }

  return (
    <div className="md:ml-8">
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={false}
      />
      <FormContainer action={removeCartItemAction}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton size="sm" className="mt-4" text="remove" />
      </FormContainer>
    </div>
  )
}
export default ThirdColumn
