import CartItemsList from "@/components/cart/CartItemsList"
import CartTotals from "@/components/cart/CartTotals"
import SectionTitle from "@/components/global/SectionTitle"
import {fetchOrCreateCart, updateCart} from "@/utils/actions"
import {auth} from "@clerk/nextjs/server"
import {redirect} from "next/navigation"

export default async function CartPage() {
  const {userId} = auth()
  if (!userId) redirect("/")

  const cart = await fetchOrCreateCart({userId})

  const {cartItems, currentCart} = await updateCart(cart)

  if (currentCart.numItemsInCart === 0)
    return <SectionTitle text="Empty Cart" />
  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <CartItemsList cartItems={cartItems} />
        </div>
        <div className="lg:col-span-4">
          <CartTotals cart={currentCart} />
        </div>
      </div>
    </>
  )
}
