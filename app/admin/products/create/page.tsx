import {SubmitButton} from "@/components/form/Button"
import CheckboxInput from "@/components/form/CheckboxInput"
import FormContainer from "@/components/form/FormContainer"
import FormInput from "@/components/form/FormInput"
import ImageInput from "@/components/form/ImageInput"
import PriceInput from "@/components/form/PriceInput"
import TextAreaInput from "@/components/form/TextArea"

import {createProductAction} from "@/utils/actions"
import {faker} from "@faker-js/faker"

export default function CreateProductPage() {
  // faker tạo random name, company, description cho new product => user ko cần phải gõ mỗi khi create new
  const name = faker.commerce.productName()
  const company = faker.company.name()
  const description = faker.lorem.paragraph({min: 10, max: 12})

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Create Products
      </h1>

      <div className="border p-8 rounded-md">
        <FormContainer action={createProductAction}>
          <div className="grid gap-4 md:grid-cols-2 my-4">
            <FormInput
              type="text"
              name="name"
              label="product name"
              defaultValue={name}
            />

            <FormInput
              type="text"
              name="company"
              label="company"
              defaultValue={company}
            />

            <PriceInput />
            <ImageInput />
          </div>

          <TextAreaInput
            name="description"
            labelText="product description"
            defaultValue={description}
          />

          <div className="mt-6">
            <CheckboxInput name="featured" label="featured" />
          </div>

          <SubmitButton text="create product" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  )
}
