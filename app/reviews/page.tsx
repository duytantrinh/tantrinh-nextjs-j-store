import {deleteReviewAction, fetchProductReviewsByUser} from "@/utils/actions"
import ReviewCard from "@/components/reviews/ReviewCard"
import SectionTitle from "@/components/global/SectionTitle"
import FormContainer from "@/components/form/FormContainer"
import {IconButton} from "@/components/form/Button"

export default async function ReviewsPage() {
  const reviews = await fetchProductReviewsByUser()

  if (reviews.length === 0) {
    return <SectionTitle text="You have No review yet" />
  }

  return (
    <>
      <SectionTitle text="Your reviews" />
      <section className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => {
          const {comment, rating, productId} = review
          const {name, image} = review.product

          const reviewInfo = {comment, rating, name, image, productId}

          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReviews reviewId={review.id} />
            </ReviewCard>
          )
        })}
      </section>
    </>
  )
}

const DeleteReviews = ({reviewId}: {reviewId: string}) => {
  const deleteReview = deleteReviewAction.bind(null, {reviewId})
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType="delete" />
    </FormContainer>
  )
}
