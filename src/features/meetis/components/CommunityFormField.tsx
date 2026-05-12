import { community } from "@/src/db/schema";
import { FormError, FormLabel, FormSelect } from "@/src/shared/components/forms";
import { Suspense, use } from "react";
import { useFormContext } from "react-hook-form";
import { MeetiInput } from "../schema/meetiSchema";

const communitiesPromise = fetch('http://localhost:3000/api/user/communities').then(res => res.json())


 function CommunityOptions() {
  const {  register, formState: {errors}} = useFormContext<MeetiInput>()
  const communities = use<{id: string, name: string}[]>(communitiesPromise)
  return (
    <>
        <FormLabel>Comunidad Meeti</FormLabel>

        <FormSelect
          {...register('communityId')}
        >
          <option value="">Selecciona Comunidads</option>
            {communities.map( community  =>  <option key={community.id} value={community.id}>
                {community.name}</option>
            )}
        </FormSelect>
            {errors.communityId && <FormError>{errors.communityId.message}</FormError>}
        
    </>
  )
}
export default function CommunityFormField() {
  return (
    <Suspense fallback={"...loading communities"} >
      <CommunityOptions />
    </Suspense>
  )
}