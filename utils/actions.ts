"use server"
import db from "@/utils/db"
import {auth, currentUser} from "@clerk/nextjs/server"
import {redirect} from "next/navigation"
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validatedWithZodSchema,
} from "./schema"
import {deleteImage, uploadImage} from "./supabase"
import {revalidatePath} from "next/cache"
import {Cart} from "@prisma/client"
import {use} from "react"

//===== get current user
const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) redirect("/")
  return user
}

//====== check current user is ad admin ?
const getAdminUser = async () => {
  const user = await getAuthUser()
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/")
  return user
}

// ====== get error
const renderError = (error: unknown): {message: string} => {
  console.log(error)
  return {
    message: error instanceof Error ? error.message : "an error occurred",
  }
}

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  })

  return products
}

// === ( FetchAllProduct )
export const fetchAllProducts = ({keyword = ""}: {keyword: string}) => {
  return db.product.findMany({
    where: {
      OR: [
        {name: {contains: keyword, mode: "insensitive"}},
        {company: {contains: keyword, mode: "insensitive"}},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const fetchSingleProduct = async (productId: string) => {
  const product = db.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) redirect("/products")
  return product
}

//============== (Create a new product)
export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{message: string}> => {
  const user = await getAuthUser()
  console.log(user)

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validatedWithZodSchema(productSchema, rawData)

    // image file
    const file = formData.get("image") as File
    const validatedImageFile = validatedWithZodSchema(imageSchema, {
      image: file,
    })

    const fullPath = await uploadImage(validatedImageFile.image)

    await db.product.create({
      data: {
        ...validatedFields,
        image: fullPath,
        clerkId: user.id,
      },
    })
  } catch (error) {
    return renderError(error)
  }

  redirect("/admin/products")
}

// show list of products at admin page
export const fetchAdminProducts = async (page = 1) => {
  // 1. check if admin, continue to fetch product, Not Admin => retun homepage
  await getAdminUser()
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    //`Pagination`

    take: 3,
    skip: (page - 1) * 3,
  })

  // { count total data for pagination}
  const totalCount = await db.product.count()

  return {products, totalCount}

  // return products
}

//======= (delete product admin page)
export const deleteProductAction = async (prevState: {productId: string}) => {
  const {productId} = prevState
  await getAdminUser()
  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    })

    // delete image at supabase
    await deleteImage(product.image)

    revalidatePath("/admin/products")

    return {message: "products deleted successfully"}
  } catch (error) {
    return renderError(error)
  }
}

//======== (fetch detail for Edit)
export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser()

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) redirect("/admin/products")

  return product
}

//======== (Update Fields except image)
export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser()
  try {
    const productId = formData.get("id") as string

    const rawData = Object.fromEntries(formData)
    const validatedFields = validatedWithZodSchema(productSchema, rawData)

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    revalidatePath("/admin/products")

    return {message: "Product updated successfully"}
  } catch (error) {
    return renderError(error)
  }
}

// ========== (Update Image)
export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser()
  try {
    // 1. get info from edit/page
    const image = formData.get("image") as File // get from <ImageInput/>
    const productId = formData.get("id") as string //get from hidden input
    const oldImageUrl = formData.get("url") as string //get from hidden input

    // 2. validated Image and Upload to supabase
    const validatedFile = validatedWithZodSchema(imageSchema, {image})
    const fullPath = await uploadImage(validatedFile.image)

    // 3. delete old image
    await deleteImage(oldImageUrl)

    // 4. update with database
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    revalidatePath("/admin/products")

    // // 7. Redirecting
    // redirect("/admin/products")

    return {message: "Image updated successfully"}
  } catch (error) {
    return renderError(error)
  }
}

export const fetchFavoriteId = async ({productId}: {productId: string}) => {
  const user = await getAuthUser()
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  })

  return favorite?.id || null
}

//===(8. toggle Favorite Button)
export const toggleFavoriteAction = async (prevState: {
  productId: string
  favoriteId: string | null
  pathname: string // for using at multiple places
}) => {
  const user = await getAuthUser()
  const {productId, favoriteId, pathname} = prevState

  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      })
    } else {
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      })
    }

    revalidatePath(pathname)
    return {
      message: favoriteId
        ? "Removed from favorites list"
        : "Added to favorites list successfully",
    }
  } catch (error) {
    return renderError(error)
  }
}

// === (fetch all favorite của 1 specific user)
export const fetchUserFavorites = async () => {
  // 1. check user sign in ?
  const user = await getAuthUser()

  // 2. get favorite list by this userId
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },

    include: {
      product: true,
    },
  })

  return favorites
}

//======= Start: Review Model
export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser()
  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validatedWithZodSchema(reviewSchema, rawData)

    // (save new review to database)
    await db.review.create({
      data: {
        ...validatedFields,
        clerkId: user.id,
      },
    })

    revalidatePath(`/products/${validatedFields.productId}`)
    return {message: "review submitted successfully"}
  } catch (error) {
    return renderError(error)
  }
}

export const fetchProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return reviews
}

// for single-product page
export const fetchProductRating = async (productId: string) => {
  const result = await db.review.groupBy({
    // group by productId
    by: ["productId"],

    // find avg of rating
    _avg: {
      rating: true,
    },

    // count number of rating/review
    _count: {
      rating: true,
    },

    where: {productId},
  })

  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  }
}

// ======= `for Reviews page`
export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser()
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      productId: true,
      rating: true,
      comment: true,
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  })

  return reviews
}
export const deleteReviewAction = async (prevState: {reviewId: string}) => {
  const {reviewId} = prevState
  const user = await getAuthUser()
  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    })

    revalidatePath("/reviews")

    return {message: "delete review successfully"}
  } catch (error) {
    return renderError(error)
  }
}

// ( only login user can leave _review , and user chỉ _review 1 product 1 lần)
export const findExistingReview = async (userId: string, productId: string) => {
  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  })
}

// {============= Cart ==========}

// fecth nnumber item in cart  - dùng tại Navbar -> CartButton
export const fetchCartItems = async () => {
  const {userId} = auth()
  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId ?? "",
    },
    select: {
      numItemsInCart: true,
    },
  })

  // ko có product naò trong cart thì return 0
  return cart?.numItemsInCart || 0
}

const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  return product
}

const includeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
}

// check xem đã có Cart chưa, nếu có lấy data ra, nếu chưa tạo mới
export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string
  errorOnFailure?: boolean
}) => {
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    // (include thêm properties của product vào CArt để Cart luôn update new product properties)
    include: includeProductClause,
  })

  if (!cart && errorOnFailure) {
    throw new Error("Cart Not Found")
  }

  // (chưa có cart thì tạo mới)
  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkId: userId,
      },
      include: includeProductClause,
    })
  }

  return cart
}

// (check xem product đã có trong Cart chưa, nếu có thì update, nếu chưa tạo mới)
const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: {
  productId: string
  cartId: string
  amount: number
}) => {
  let cartItem = await db.cartItem.findFirst({
    where: {
      productId,
      cartId,
    },
  })

  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    })
  } else {
    cartItem = await db.cartItem.create({
      data: {
        amount,
        productId,
        cartId,
      },
    })
  }
}

// update số lượng tồng item, tông tiền trong Cart - type là toàn bộ model Cart
export const updateCart = async (cart: Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // console.log(cartItems)

  let numItemsInCart = 0 // for tồng items trong cart
  let cartTotal = 0 // for tồng tiền

  for (const item of cartItems) {
    numItemsInCart += item.amount
    cartTotal += item.amount * item.product.price
  }

  const tax = cart.taxRate * cartTotal
  const shipping = cartTotal ? cart.shipping : 0
  const orderTotal = cartTotal + tax + shipping

  const currentCart = await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
    include: includeProductClause, // đề access current Cart
  })

  return {cartItems, currentCart}
}

export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser()
  try {
    const productId = formData.get("productId") as string
    const amount = Number(formData.get("amount"))

    // 1. lấy hết info của product(dựa vào productId) để hiền thị lên Cart
    await fetchProduct(productId)

    // 2. check xem đã có Cart chưa, nếu có lấy data ra, nếu chưa tạo mới
    const cart = await fetchOrCreateCart({userId: user.id})

    // 3. check xem product này đã có trong Cart chưa, nếu có thì update, nếu chưa tạo mới
    await updateOrCreateCartItem({productId, cartId: cart.id, amount})

    // 4. update cart
    await updateCart(cart)
  } catch (error) {
    return renderError(error)
  }

  redirect("/cart")
}

export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser()

  try {
    const cartItemId = formData.get("id") as string

    // 1. fetch current cart of this current user
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    })

    // 2. remove specific item
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id, // make sure remove item belongs to cart of this current user
      },
    })

    // 3. update the total
    await updateCart(cart)
    revalidatePath("/cart")

    return {message: "Item removed from cart successfully"}
  } catch (error) {
    return renderError(error)
  }
}

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number
  cartItemId: string
}) => {
  const user = await getAuthUser()

  try {
    // 1. fetch current cart of this current user
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    })

    // 2. update specific item
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    })

    // 3. update the total
    await updateCart(cart)
    revalidatePath("/cart")
    return {message: "cart updated successfully"}
  } catch (error) {
    return renderError(error)
  }
}

//========= Order Model
export const createOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser()
  let orderId: null | string = null
  let cartId: null | string = null

  try {
    // 1. fetch current cart
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true, // nếu chưa có cart thì báo lỗi
    })

    cartId = cart.id

    // 2. delete order (chưa Paid)
    await db.order.deleteMany({
      where: {
        clerkId: user.id,
        isPaid: false,
      },
    })

    // 3. create new order (đã Paid)
    const order = await db.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    })

    // 4.
    orderId = order.id
  } catch (error) {
    return renderError(error)
  }

  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`)
}

// ( fetch orders of current user =- orders/page UI)
export const fetchUserOrders = async () => {
  const user = await getAuthUser()
  const orders = await db.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true, // only save paid orders
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return orders
}

// (======== orders of only admin - admin dashboard page )
export const fetchAdminOrders = async () => {
  const user = await getAdminUser()

  const orders = await db.order.findMany({
    where: {
      isPaid: true, // only save paid orders
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return orders
}

// `==  Prisma query`
/*
  findFirst() : lấy firstValue đề check có hay ko ?
  findMany() : lấy tất cả value
*/
