"use server"

import { requireAuth } from "@/src/lib/auth-server";
import { meetiAttendeesService } from "../services/MeetiAttendeesService";
import { getClientIp } from "@/src/shared/utils/ip";
import { ratelimit } from "@/src/lib/limiter";
import { getMinutesDiffFromNow } from "@/src/shared/utils/date";

export async function toggleAttendance(meetiId: string, canConfirm: boolean) {

    const ip = await getClientIp()
    const { success, limit, remaining, reset  }  = await ratelimit.limit(ip)

    if(!success) {
        return {
            error:  `Limite Alcanzado. intenta en ${getMinutesDiffFromNow(reset)} Minutos`,
            success: '',
            newPermissions: {
                canConfirm,
                canCancel: !canConfirm
            }
        }
    }
   


    const { session } = await requireAuth()
    if(!session) throw new Error('Usuario no Autenticado')

    return await meetiAttendeesService.toggleAttendance(meetiId, session.user)
}