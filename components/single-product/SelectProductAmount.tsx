import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// chỉ hiển thị tại 2 chổ , 1 là trang detail single product , 2 là tại Cart/page
// số lượng hiền thị 2 chỗ khác nhau nên thêm Mode để xử lý
export enum Mode {
  SingleProduct = "singleProduct",
  CartItem = "cartItem",
}

type SelectProductAmountProps = {
  mode: Mode.SingleProduct
  amount: number
  setAmount: (value: number) => void // control number amount tại <select><option/></select>
}

type SelectCartItemAmountProps = {
  mode: Mode.CartItem
  amount: number
  setAmount: (value: number) => Promise<void> // dùng trong async function ==> return Promise
  isLoading: boolean
}

export default function SelectProductAmount(
  props: SelectProductAmountProps | SelectCartItemAmountProps
) {
  const {mode, amount, setAmount} = props

  const cartItem = mode === Mode.CartItem

  return (
    <>
      <h4 className="mb-2">Amount: </h4>
      <Select
        defaultValue={amount.toString()} // defaultValue thì cần chuyền sang string (type mặc định của defaultValue)
        onValueChange={(value) => setAmount(Number(value))} // setAmount chuyền lại về nNumber đề lưu vào database
        disabled={cartItem ? props.isLoading : false}
      >
        <SelectTrigger className={cartItem ? "w-[100px]" : "w-[150px]"}>
          <SelectValue placeholder={amount} />
        </SelectTrigger>
        <SelectContent>
          {/* // trang single product : hiền thị max 10
            // trang Cart/page : hiền thị số item đã chọn bên single_page + 10  */}
          {Array.from({length: cartItem ? amount + 10 : 10}, (_, index) => {
            const selectValue = (index + 1).toString()
            return (
              <SelectItem key={selectValue} value={selectValue}>
                {selectValue}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </>
  )
}
