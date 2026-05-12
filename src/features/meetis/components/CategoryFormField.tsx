import { FormError, FormLabel, FormSelect } from "@/src/shared/components/forms";
import { Suspense, use } from "react";
import { SelectCategory } from "../types/meeti.type";
import { useFormContext } from "react-hook-form";
import { MeetiInput } from "../schema/meetiSchema";

const categoriesPromise = fetch('http://localhost:3000/api/categories').then(res => res.json())


 function CategoryOptions() {
  const {  register, formState: {errors}} = useFormContext<MeetiInput>()
  const categories  = use<SelectCategory[]>(categoriesPromise)
  return (
    <>
        <FormLabel>Categoria Meeti</FormLabel>

        <FormSelect
          {...register('categoryId')}
        >
          <option value="">Selecciona Categoria</option>
            {categories.map( category  =>  <option key={category.id} value={category.id}>
                {category.name}</option>
            )}
        </FormSelect>
            {errors.categoryId && <FormError>{errors.categoryId.message}</FormError>}
        
    </>
  )
}
export default function CategoryFormField() {
  return (
    <Suspense fallback={"...loading communities"} >
      <CategoryOptions />
    </Suspense>
  )
}