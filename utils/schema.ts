import {z, ZodSchema} from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(100, {
      message: "name must be less than 100 characters.",
    }),
  company: z.string(),
  featured: z.coerce.boolean(),
  price: z.coerce.number().int().min(0, {
    message: "price must be a positive number.",
  }),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length
      return wordCount >= 10 && wordCount <= 1000
    },
    {
      message: "description must be between 10 and 1000 words.",
    }
  ),
})

// (hàm chung cho validated các schema - xem cách sử dụng tại actions)
export function validatedWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data)

  // (custom the error)
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message)
    throw new Error(errors.join(","))
  }

  return result.data
}

// (hàm chung cho validated Image File)
export const imageSchema = z.object({
  image: validatedImageFile(),
})

function validatedImageFile() {
  const maxUploadFile = 1024 * 1024
  const acceptedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ]

  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadFile
    }, "File size must be less than 1MB")
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      )
    }, "File must be an image")
}

// (hàm chung cho validated REviews)
export const reviewSchema = z.object({
  productId: z.string().refine((value) => value !== "", {
    message: "Product ID cannot be empty",
  }),
  authorName: z.string().refine((value) => value !== "", {
    message: "Author name cannot be empty",
  }),
  authorImageUrl: z.string().refine((value) => value !== "", {
    message: "Author image URL cannot be empty",
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, {message: "Rating must be at least 1"})
    .max(5, {message: "Rating must be at most 5"}),
  comment: z
    .string()
    .min(10, {message: "Comment must be at least 10 characters long"})
    .max(1000, {message: "Comment must be at most 1000 characters long"}),
})

// (Pagination - dùng zod để check incoming data validation - number - số int - số positive và optional)
export const pageNumberSchema = z.coerce.number().int().positive().optional()
