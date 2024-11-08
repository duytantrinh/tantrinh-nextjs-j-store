import {FaStar, FaRegStar} from "react-icons/fa"

export default function Rating({rating}: {rating: number}) {
  const stars = Array.from({length: 5}, (_, i) => i + 1 <= rating)
  // Eg: Rating is 2 star =>
  // 1 <= 2 : true ==> true return full star FaStar
  // 2 <= 2 : true
  // 3 <= 2 : false ==> false return empty star FaRegStar
  // 4 <= 2 : false ==> false return empty star
  // 5 <= 2 : false ==> false return empty star

  return (
    <div className="flex items-center gap-x-1">
      {stars.map((fullStar, i) => {
        const className = `w-3 h-3 ${
          fullStar ? "text-primary" : "text-grey-400"
        }`
        return fullStar ? (
          <FaStar className={className} key={i} />
        ) : (
          <FaRegStar className={className} key={i} />
        )
      })}
    </div>
  )
}
