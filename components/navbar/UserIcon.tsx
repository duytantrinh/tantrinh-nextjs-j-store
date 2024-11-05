import {LuUser2} from "react-icons/lu"
import {currentUser} from "@clerk/nextjs/server"
import Image from "next/image"

export default async function UserIcon() {
  const user = await currentUser()
  console.log(user)

  const profileImage = user?.imageUrl

  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt="Current user"
        width={24}
        height={24}
        className="w-6 h-6 rounded-full object-cover"
      />
    )
  }

  return <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" />
}
