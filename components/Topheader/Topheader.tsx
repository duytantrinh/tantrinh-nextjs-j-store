import React from "react"

export default function Topheader() {
  return (
    <header className=" border-b">
      <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-3 text-sm">
        Login with email:{" "}
        <span className="text-primary font-bold">trinhtan11@gmail.com</span>
        {" - "}
        password:{" "}
        <span className="text-primary font-bold">trinhtan123@test</span> to
        access to admin dashboard page
      </div>
    </header>
  )
}
