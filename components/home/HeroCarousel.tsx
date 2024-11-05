import hero1 from "@/public/images/hero1.jpg"
import hero2 from "@/public/images/hero2.jpg"
import hero3 from "@/public/images/hero3.jpg"
import hero4 from "@/public/images/hero4.jpg"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import {Card, CardContent} from "../ui/card"
import Image from "next/image"

const carouselImages = [hero1, hero2, hero3, hero4]

export default function HeroCarousel() {
  return (
    <div className="hidden lg:block">
      <Carousel>
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="p-2">
                  <Image
                    src={image}
                    alt="Hero Image"
                    className="object-cover w-full h-[384px] rounded-md"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
