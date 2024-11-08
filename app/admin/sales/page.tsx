import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {fetchAdminOrders, fetchUserOrders} from "@/utils/actions"
import {formatCurrency, formatDate} from "@/utils/format"

async function SalesPage() {
  let orderAdmin = await fetchAdminOrders()
  const ordersUser = await fetchUserOrders()

  orderAdmin = orderAdmin.concat(ordersUser)

  // Unique array using filter and indexOf functions
  let orders = orderAdmin.filter(
    (value, index, self) =>
      self.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(value)) ===
      index
  )

  return (
    <div>
      <Table>
        <TableCaption>Total orders : {orders.length}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Order Total</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const {id, products, orderTotal, tax, shipping, createdAt, email} =
              order

            return (
              <TableRow key={order.id}>
                <TableCell>{email}</TableCell>
                <TableCell>{products}</TableCell>
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{formatCurrency(tax)}</TableCell>
                <TableCell>{formatCurrency(shipping)}</TableCell>
                <TableCell>{formatDate(createdAt)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
export default SalesPage
