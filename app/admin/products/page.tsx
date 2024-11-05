import EmptyList from "@/components/global/EmptyList"
import {deleteProductAction, fetchAdminProducts} from "@/utils/actions"
import Link from "next/link"

import {formatCurrency} from "@/utils/format"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {IconButton} from "@/components/form/Button"
import FormContainer from "@/components/form/FormContainer"
import {pageNumberSchema} from "@/utils/schema"
import PaginationControl from "@/components/form/PaginationControl"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined}
}) {
  //============= Start :`Pagination`

  const parsedPage = pageNumberSchema.safeParse(searchParams.page)
  if (!parsedPage.success) {
    throw new Error("Invalid page number")
  }

  const page = parsedPage.data || 1

  const {products: items, totalCount} = await fetchAdminProducts(page)

  if (items.length === 0) return <EmptyList />

  const previousPath = page > 1 ? `/admin/products?page=${page - 1}` : ""
  const nextPath =
    totalCount > 3 * page ? `/admin/products?page=${page + 1}` : ""

  //============= End: `Pagination`

  return (
    <section>
      <Table>
        <TableCaption className="capitalize">
          Total Product: {totalCount}.
          <section className=" w-full mt-7">
            <PaginationControl
              previousPath={previousPath}
              page={page}
              nextPath={nextPath}
            />
          </section>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-lg">Product Name</TableHead>
            <TableHead className="font-bold text-lg">Company</TableHead>
            <TableHead className="font-bold text-lg">Price</TableHead>
            <TableHead className="font-bold text-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const {id: productId, name, company, price} = item
            return (
              <TableRow key={productId}>
                <TableCell className="font-medium">
                  <Link
                    href={`/products/${productId}`}
                    className="'underline text-muted-foreground tracking-wide capitalize"
                  >
                    {name}
                  </Link>
                </TableCell>

                <TableCell>{company}</TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/admin/products/${productId}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>

                  <DeleteProduct productId={productId} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

function DeleteProduct({productId}: {productId: string}) {
  // pass productId to server action deleteProductAction at actions.ts
  const deleteProduct = deleteProductAction.bind(null, {productId})

  return (
    <FormContainer action={deleteProduct}>
      <IconButton actionType="delete" />
    </FormContainer>
  )
}
