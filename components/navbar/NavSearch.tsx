"use client"
import {Input} from "../ui/input"
import {useSearchParams, useRouter} from "next/navigation"
import {useDebouncedCallback} from "use-debounce" // ( tạo delay )
import {useState, useEffect} from "react"

function NavSearch() {
  const searchParams = useSearchParams()
  const {replace} = useRouter()
  const [search, setSearch] = useState(
    searchParams.get("keyword")?.toString() || ""
  )

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("keyword", value) // (đặt cho params trên url là keyword)
    } else {
      params.delete("keyword")
    }
    replace(`/products?${params.toString()}`)
  }, 300)

  useEffect(() => {
    if (!searchParams.get("keyword")) {
      setSearch("")
    }
  }, [searchParams])
  return (
    <Input
      type="search"
      placeholder="search product..."
      className="max-w-xs dark:bg-muted "
      onChange={(e) => {
        setSearch(e.target.value)
        handleSearch(e.target.value)
      }}
      value={search}
    />
  )
}
export default NavSearch
