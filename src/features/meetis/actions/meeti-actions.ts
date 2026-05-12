"use server"

import { requireAuth } from "@/src/lib/auth-server"
import { MeetiInput, MeetiSchema } from "../schema/meetiSchema"
import { meetiService } from "../services/MeetiService"
import { error } from "console"

export async function createMeetiAction(input: MeetiInput) {
    const { session} = await requireAuth()
    if(!session) {
        return {
            error: 'No Autenticado',
            success: ''
        }
    }
    const data  = MeetiSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    await meetiService.createMeeti(data.data, session.user)

    return {
        success: 'Meeti Creado Correctamente',
        error: ''
     }
  
}

export async function editMeetiAction(input: MeetiInput, meetiId: string) {
    const { session} = await requireAuth()
    if(!session) {
        return {
            error: 'No Autenticado',
            success: ''
        }
    }
    const data  = MeetiSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    await meetiService.updateMeeti(meetiId, data.data, session.user)

    return {
        error: '',
        success: 'Meeti Actualizado Correctamente'
    }
}

export async function deleteMeetiAction(meetiId: string) {
      const { session} = await requireAuth()
    if(!session) {
        return {
            error: 'No Autenticado',
            success: ''
        }
    }
    const response = await meetiService.deleteMeeti(meetiId, session.user)
    return response

}