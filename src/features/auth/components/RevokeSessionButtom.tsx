"use client"

import { revokeSession } from "@/src/lib/auth-client"
import { redirect } from "next/navigation"
import toast from "react-hot-toast"

type Props = {
  token: string
}

export default function RevokeSessionButtom({token} : Props) {
  return (
    <button className="bg-red-600 font-bold px-3 py-1 rounded-sm text-white text-sm cursor-pointer"
    onClick={async() => {
        await revokeSession({token})
        toast.success('Se cerro loa sesion correctamente')
        redirect('/dashboard')
    }}
    
    >Cerrar sesion</button>
  )
}
