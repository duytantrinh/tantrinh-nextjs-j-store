import ProductsContainer from "@/components/products/ProductsContainer"

type ProductsPageProps = {
  searchParams: {format?: string; keyword?: string}
}

export default function ProductsPage({searchParams}: ProductsPageProps) {
  const format = searchParams.format || "grid"
  const keyword = searchParams.keyword || ""
  return <ProductsContainer format={format} keyword={keyword} />
}

/*
  `keyword cho searchParams là tự đặt`
   Eg:- format : cho kiểu hiễn thị products 
      - keyword: từ khóa nhận đc từ search query
  {1. truyền format, keyword qua ProductsContainer như props}
   tùy vào format và keyword nhận được sẽ tạo đường link url (<Link href={`/products?format=grid$&keyword=${keyword}`}>)  để hiển thị products
  `

  {2. dựa vào từ khóa search gởi vào fetchAllProducts() để hiển thị products list}
  `xem cách viết query OR cho fetchAllProducts tại actions.ts`
*/
