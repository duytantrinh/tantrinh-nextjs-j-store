import React from "react"
import HeroCarousel from "./HeroCarousel"
import {Button} from "../ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center ">
      <div>
        <h1 className="max-w-2xl font-bold text-4xl tracking-tight sm:text-6xl">
          We are changing the way people shop
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas et
          autem atque rem eum maxime odio, perferendis ipsa vel modi?
          Perspiciatis magnam ducimus accusamus similique quaerat. Reprehenderit
          numquam enim nobis!
        </p>
        <Button asChild className="mt-10" size="lg">
          <Link href="/products">Our Products</Link>
        </Button>
      </div>
      <HeroCarousel />
    </section>
  )
}
