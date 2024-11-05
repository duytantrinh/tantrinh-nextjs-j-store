"use server"
import db from "@/utils/db"
import {auth, currentUser} from "@clerk/nextjs/server"
import {redirect} from "next/navigation"
import {imageSchema, productSchema, validatedWithZodSchema} from "./schema"
import {deleteImage, uploadImage} from "./supabase"
import {revalidatePath} from "next/cache"

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
