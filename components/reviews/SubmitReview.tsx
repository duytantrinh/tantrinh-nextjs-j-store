"use client"
import {useState} from "react"
import {SubmitButton} from "@/components/form/Button"
import FormContainer from "@/components/form/FormContainer"
import {Card} from "@/components/ui/card"
import RatingInput from "@/components/reviews/RatingInput"
import TextAreaInput from "@/components/form/TextArea"
import {Button} from "@/components/ui/button"
import {createReviewAction} from "@/utils/actions"
import {useUser} from "@clerk/nextjs"

// because this is a client component == >CANNOT USE auth() => use useUser()
export default function SubmitReview({productId}: {productId: string}) {
  const [isReviewFromVisible, setIsReviewFromVisible] = useState(false)
  const {user} = useUser()
  // console.log(useUser())

  return (
    <div>
      <Button
        size="lg"
        className="capitalize my-4"
        onClick={() => setIsReviewFromVisible((prev) => !prev)}
      >
        leave review
      </Button>

      {isReviewFromVisible && (
        <Card className="p-8 mt-8">
          <FormContainer action={createReviewAction}>
            <input type="hidden" name="productId" value={productId} />
            <input
              type="hidden"
              name="authorName"
              value={user?.firstName || "user"}
            />
            <input type="hidden" name="authorImageUrl" value={user?.imageUrl} />
            <RatingInput name="rating" />
            <TextAreaInput
              name="comment"
              labelText="feedback"
              defaultValue="Outstanding product!!!"
            />
            <SubmitButton className="mt-4" />
          </FormContainer>
        </Card>
      )}
    </div>
  )
}
