"use client"

import UploadImage from "@/src/shared/components/upload/UploadImage"
import { Form, FormError, FormInput, FormLabel, FormSubmit, FormTextArea } from "@/src/shared/components/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { ProfileInput, ProfileSchema } from "../schemas/profileSchema"
import { User } from "../../auth/types/auth.types"
import { updeteProfileAction } from "../actions/profile-actions"
import toast from "react-hot-toast"

type Props = {
    user: User
}

export default function ProfileForm({user} : Props) {

    const methods = useForm({
        resolver: zodResolver(ProfileSchema),
        mode: 'all',
        defaultValues : {
            name: user.name,
            image: user.image ?? '',
        }
    })
    const { register, handleSubmit, formState: {errors}} = methods

    const onSubmit = async(data: ProfileInput) => {
     const { error, success } = await updeteProfileAction(data)
     if(error) {
        toast.error(error)
     }
     if(success) {
        toast.success(success)
     }
    }
    return (
    <FormProvider  {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)} >
            <FormLabel htmlFor='name'>Nombre:</FormLabel>
            <FormInput
                id="name"
                type='text'
                placeholder='Tu Nombre'
                {...register('name')}
            />
            {errors.name && <FormError>{errors.name.message}</FormError>}

        
            <FormLabel>Imagen Perfil</FormLabel>
            <UploadImage 
            uploaderImageLabel={'imagen perfil'}
            {...register('image')}
            />



            <FormSubmit
                value={'Guardar Cambios'}
            />
        </Form>
     </FormProvider>

    )
}
