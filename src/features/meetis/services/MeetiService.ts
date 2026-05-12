import { User } from "better-auth";
import { MeetiInput } from "../schema/meetiSchema";
import { IMeetiRepository, meetiRepository } from "./MeetiRepositori";
import { communityRepository, ICommunityRepository } from "../../communities/services/CommunityRepository";
import { CommunityPolicy } from "../../communities/policies/CommunityPolicy";
import { MeetiPolicy } from "../policies/MeetiPolicy";
import { IMeetiAttendeesRepository, meetiAttendeesRepository } from "./MeetiAttendeesRepository";
import { MeetiAttendeePolicy } from "../policies/MeetiAttendeePolicy";
import { deleteUTFiles } from "@/src/lib/uploadthing-server";
import { error } from "console";

class MeetiService {
    constructor(
        private meetiRepository: IMeetiRepository,
        private communityRepository: ICommunityRepository,
        private meetyAttendeesRepository: IMeetiAttendeesRepository

    ) { }
    async createMeeti(data: MeetiInput, user: User) {
        const community = await this.communityRepository.findById(data.communityId)
        if (!community || !CommunityPolicy.isAdmin(user, community)) {
            throw new Error('No tienes Permisos')
        }
        await this.meetiRepository.insert({ ...data, createdBy: user.id })

    }

    async getUpcomigMeetisByUser(user: User) {
        const upcomingMeetis = await this.meetiRepository.findUpcomingByUserId(user.id)

        const enriched = await Promise.all(upcomingMeetis.map(async (meeti) => {

            const attendanceCount = await this.meetyAttendeesRepository.findAttendeesCount(meeti.id)
            return {
                data: meeti,
                attendanceCount,
                context: {
                    isAdmin: MeetiPolicy.isAdmin(user, meeti)
                },
                permissions: {
                    canViewAttendents: MeetiPolicy.canViewAttendes(user, meeti),
                    canEdit: MeetiPolicy.canEdit(user, meeti),
                    canDelet: MeetiPolicy.canEdit(user, meeti),


                }
            }

        }))

        return enriched

    }

    async getUpcoming() {
        return await this.meetiRepository.findUpcoming()
    }

    async getMeetiById(meetiId: string) {
        const meeti = await this.meetiRepository.findById(meetiId)
        if (!meeti) throw new Error('Meeti no encontrado')
        return meeti
    }
        // se quito el User --------
    async getMeetiWithDetails(meetiId: string, user?: User) {
        const meeti = await this.meetiRepository.findFullById(meetiId)

        if (!meeti) throw new Error('Meeti no encontrado')
        const isPastMeeti = MeetiPolicy.isPastMeeti(meeti)
        

        if (!user) {
            return {
                  data: meeti,
            context: {
                isAdmin: false,
                isPastMeeti,
                isAttending: false,
            },
            permission: null
            }
        }
        
        const isAttending = await this.meetyAttendeesRepository.isUserAttending(user.id, meeti.id)
        const isAdmin = MeetiPolicy.isAdmin(user, meeti)

        return {
            data: meeti,
            context: {
                isAdmin,
                isPastMeeti,
                isAttending
            },
            permission: {
                canConfirm: MeetiAttendeePolicy.canConfirm(user, meeti, isAttending),
                canCancel: MeetiAttendeePolicy.canCancel(user, meeti, isAttending)

            }
        }
    }

    async getMeetiWithPermissions(meetiId: string, user: User) {
        const meeti = await this.getMeetiById(meetiId)

        return {
            data: meeti,
            context: {
                isAdmin: MeetiPolicy.isAdmin(user, meeti),
                canEdit: MeetiPolicy.canEdit(user, meeti),
                canDelet: MeetiPolicy.canDelete(user, meeti)

            },
            permissions: {
                canEdit: CommunityPolicy,
                canDelete: CommunityPolicy
            }
        }
    }

    async updateMeeti(meetiId: string, data: MeetiInput, user: User) {
        const community = await this.communityRepository.findById(data.communityId)
        if (!community || !CommunityPolicy.isAdmin(user, community)) {
            throw new Error('No tienes Permisos')
        }

        const meeti = await this.getMeetiWithPermissions(meetiId, user)
        if(!meeti.permissions.canEdit) {
            throw new Error('No Autorizado')
        }
        await this.meetiRepository
                    .update({...data, createdBy: user.id}, meeti.data.id)
                

        }

    async getMeetiAttendees(meetiId: string, user: User ) {
        const meeti = await this.getMeetiById(meetiId)
        if(!MeetiPolicy.canViewAttendes(user, meeti)) {
            throw new Error('No Autorizado')
        }

        const attendees = await this.meetyAttendeesRepository.findAttendeesByMeetiId(meeti.id)

        return {
            meeti,
            attendees
        }
    }
    async getMeetisByCategory(categoryId: string) {
        return await this.meetiRepository.findByCategory(categoryId)
    }
    async deleteMeeti(meetiId: string, user: User) {
        // optener el Meeti
        const meeti = await this.getMeetiById(meetiId)

        //Revisar Permisos
        if(!MeetiPolicy.canDelete(user, meeti)) {
            throw new Error('No tienes Permisos Para eliminar')
        }

        // Eliminar
        await this.meetiRepository.delete(meetiId)
        await deleteUTFiles(meeti.image)

        return {
            error: '',
            success: 'Meeti eliminado correctamente'
        }
    }
    async getMeetisByTopic(query: string) {
        return await this.meetiRepository.searchByTopic(query)
    }
    async getVirtualsMeetis(query?: string) {
        return await this.meetiRepository.searchVirtual(query)
    }
     async getInPersonMeetis(query?: string, city?: string, country?: string, today?: boolean) {
       return  await this.meetiRepository.searchByLocation(query, city, country, today)

   }

    }


export const meetiService = new MeetiService(
                meetiRepository, 
                communityRepository, 
                meetiAttendeesRepository)