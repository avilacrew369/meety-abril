import Heading from "@/src/shared/components/typography/Heading";
import { authService } from "../services/AuthService";
import { formatUserAgent } from "@/src/shared/utils/user-agent";
import RevokeSessionButtom from "./RevokeSessionButtom";

export default async  function ActiveSessionsList() {

   

    const [sessions, currentSession ] = await Promise.all([
        authService.getSessions(),
        authService.getSession()
    ])

    const isCurrentDevice = (currentSessionId: string) => currentSessionId === currentSession?.session.id

  return (
    <>
        <Heading level={2} className="mt-10">Seciones Activas</Heading>

        <div className=" mt-10 p-5 border border-gray-200">
            {sessions.map( session => (
                <div key={session.id} className="p-5 shadow-xs flex items-center"  >
                    <div className="lg:flex lg:gap-2 lg:items-center flex-1"  >
                        <p>{formatUserAgent(session.userAgent!)}</p>
                        {isCurrentDevice(session.id)} && <p className="text-green-700 font-bold bg-green-200 border border-green-400 rounded-sm inline-block p-1">Este Dispositivo</p>

                    </div>
                    <RevokeSessionButtom token={session.token}  />

                </div>
            ))}

        </div>
    </>
  )
}
