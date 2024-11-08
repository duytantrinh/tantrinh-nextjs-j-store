import BreadCrumbs from "@/components/single-product/BreadCrumbs"
import {fetchSingleProduct, findExistingReview} from "@/utils/actions"
import Image from "next/image"
import {formatCurrency} from "@/utils/format"
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton"
import AddToCart from "@/components/single-product/AddToCart"
import ProductRating from "@/components/single-product/ProductRating"
import ShareButton from "@/components/single-product/ShareButton"
import ProductReviews from "@/components/reviews/ProductReviews"
import SubmitReview from "@/components/reviews/SubmitReview"
import {auth} from "@clerk/nextjs/server"

export default async function SingleProductPage({
  params,
}: {
  params: {productId: string}
}) {
  const product = await fetchSingleProduct(params.productId)

  if (!product) return "No product found..."

  const {name, image, company, description, price} = product
  const dollarsAmount = formatCurrency(price)

  // for _review function
  const {userId} = auth()
  const reviewDoesNotExist =
    userId && !(await findExistingReview(userId, product.id))

  return (
    <section>
      <BreadCrumbs name={product?.name} />
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        {/* IMAGE FIRST COL */}
        <div className="relative h-full max-md:h-[300px]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw"
            priority
            className="w-full rounded-md object-cover"
          />
        </div>
        {/* PRODUCT INFO SECOND COL */}
        <div>
          <div className="flex gap-x-8 items-center">
            <h1 className="capitalize text-3xl font-bold">{name}</h1>
            <div className="flex items-center gap-x-2">
              <FavoriteToggleButton productId={params.productId} />
              <ShareButton name={product.name} productId={params.productId} />
            </div>
          </div>
          <ProductRating productId={params.productId} />
          <h4 className="text-xl mt-2">{company}</h4>
          <p className="mt-3 text-md bg-muted inline-block p-2 rounded-md">
            {dollarsAmount}
          </p>
          <p className="mt-6 leading-8 text-muted-foreground">{description}</p>
          <AddToCart productId={params.productId} />
        </div>
      </div>

      {/* // (_Review/Ratings) */}
      <ProductReviews productId={params.productId} />

      {reviewDoesNotExist && <SubmitReview productId={params.productId} />}
    </section>
  )
}
