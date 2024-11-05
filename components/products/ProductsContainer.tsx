import ProductsGrid from "./ProductsGrid"
import ProductsList from "./ProductsList"
import {LuLayoutGrid, LuList} from "react-icons/lu"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {fetchAllProducts} from "@/utils/actions"
import Link from "next/link"

async function ProductsContainer({
  format,
  keyword,
}: {
  format: string
  keyword: string
}) {
  // 1. get all products
  const products = await fetchAllProducts({keyword})
  const totalProducts = products.length

  // 2. get keyword search query
  const keywordTerm = keyword ? `&keyword=${keyword}` : ""
  return (
    <>
      {/* HEADER */}
      <section>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg">
            {totalProducts} product{totalProducts > 1 && "s"}
          </h4>
          <div className="flex gap-x-4">
            <Button
              variant={format === "grid" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href={`/products?format=grid${keywordTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={format === "list" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href={`/products?format=list${keywordTerm}`}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className="mt-4" />
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your keyword...
          </h5>
        ) : format === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  )
}
export default ProductsContainer
