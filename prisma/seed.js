// 1 . khời tạo file
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

// 2. import products
const products = require("./products.json")

// 3. hàm xử lý : seed products data vào model product
async function main() {
  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect() // disconnect khi success
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
