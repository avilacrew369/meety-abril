"use client"

import { useState } from "react"
import { MeetiPermitions } from "../types/meeti.type"
import { toggleAttendance } from "../actions/attendance-actions"
import toast from "react-hot-toast"

type Props = {
    meetiId: string
    permissions: MeetiPermitions
}
export default function AttendanceToogleBotton({meetiId, permissions} : Props) {

    const [canConfirm, SetCantConfirm] = useState(permissions.canConfirm)

    const handleClick = async () => {
        const result =  await toggleAttendance(meetiId, canConfirm)
        if(result?.error) {
            toast.error(result.error)
        }
        if(result?.success) {
            toast.success(result.success)
            SetCantConfirm(result.newPermissions.canConfirm)
        }
   }

  return (
    <>
        <button
                className={` ${canConfirm ? 'bg-orange-400' : 'bg-red-500'} font-bold text-lg w-fulL Lg:w-auto px-5 py-2 text-white cursor-pointer  `}
                onClick={handleClick}
            > {canConfirm ? ' Confirmar Asistencia' : ' Cancelar Asistencia'} </button >
    </>
  )
}
