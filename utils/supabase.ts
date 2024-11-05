import {createClient} from "@supabase/supabase-js"

const bucket = "main-bucket" // bucket name where to upload images

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
)

// upload image vào bucket supbase
export const uploadImage = async (image: File) => {
  const timestamp = Date.now()
  const newName = `${timestamp}-${image.name}` // create unique name
  // const newName = `/users/${timestamp}-${image.name}`; // upload to specific folder on bucket

  const {data} = await supabase.storage
    .from(bucket)
    .upload(newName, image, {cacheControl: "3600"})

  if (!data) throw new Error("Image upload failed")
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl
}

// delete old image inside bucket supbase when deleting product
export const deleteImage = async (url: string) => {
  const imageName = url.split("/").pop() // get last value from url of product.image

  if (!imageName) throw new Error("inValid URL")

  return supabase.storage.from(bucket).remove([imageName])
}
