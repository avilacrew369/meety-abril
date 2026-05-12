import { User } from "better-auth";
import { CommunityInput } from "../schemas/communitySchema";
import { communityRepository, ICommunityRepository } from "./CommunityRepository";
import { CommunityPolicy } from "../policies/CommunityPolicy";
import { MembershipPolicy } from "../policies/MembershipPolicy";
import { notFound } from "next/navigation";
import { checkPassword } from "@/src/shared/utils/auth";
import { deleteUTFiles } from "@/src/lib/uploadthing-server";
import {  IMenbershipRepository, membershipRepository } from "./MembershipRepository";
import { IMeetiRepository, meetiRepository } from "../../meetis/services/MeetiRepositori";
import { IProfileRepository, profileRepository } from "../../profile/services/ProfileRepository";

class CommunityService {
    constructor (
        private communityRepository: ICommunityRepository,
        private membershipRepository: IMenbershipRepository,
        private meetiRepository: IMeetiRepository,
        private profileRepository: IProfileRepository

    ){}
    async createCommunity(data : CommunityInput, userId: string) {
        const community = await this.communityRepository.create({
           ...data,
           creteBy: userId
        })
        return community
    }
    async getUserCommunitesForAPI(userId: string) {
        const communities = await this.communityRepository.findByUser(userId)
        return communities.map( community => ({
            id: community.id,
            name: community.name,
            
        })
            
        )
    }
    async getUserCommunity(user: User) {

        const communities = await this.communityRepository.findByUser(user.id, 10)

        const enriched = await Promise.all(communities.map(async (community) => {
            const isMember = true
            const isAdmin = CommunityPolicy.isAdmin(user, community)
            const memberCount = await this.membershipRepository.getMemberCount(community.id)

            return {
                data: community,
                memberCount,
                context: {
                    isMember,
                    isAdmin
                },
                permissions: {
                    canEdit: CommunityPolicy.canEdit(user, community),
                    canDelete: CommunityPolicy.canDelete(user, community),
                    canJoin: MembershipPolicy.canJoin(user, community, isMember),
                    canLeave: MembershipPolicy.canLeave(user, community, isMember),
                    canViewMembers: CommunityPolicy.canViewMembers(user, community)

                }
            }
        }))
        return enriched
    }

    async getCommunity(communityId: string ) {
        const community = await this.communityRepository.findById(communityId)
        if(!community) notFound()
        return community
    }

    async getCommunityDetails(communityId: string, user?: User) {
        const community = await this.getCommunity(communityId)
        const memberCount = await this.membershipRepository.getMemberCount(community.id)
        const admin = await this.profileRepository.findById(community.creteBy)
        


        if(!user) {
            return {
                data: {...community, admin},
                memberCount,
                context: null,
                permissions: null
            }
        }
        const isMember = await this.membershipRepository.isMember(community.id, user.id)
        const isAdmin = CommunityPolicy.isAdmin(user, community)
           return {
                data: {...community, admin},
                memberCount,
                context: {
                    isMember,
                    isAdmin
                },
                permissions: {
                    canEdit: CommunityPolicy.canEdit(user, community),
                    canDelete: CommunityPolicy.canDelete(user, community),
                    canJoin: MembershipPolicy.canJoin(user, community, isMember),
                    canLeave: MembershipPolicy.canLeave(user, community, isMember),
                    canViewMembers: CommunityPolicy.canViewMembers(user, community)

                }
            }
    }

    async updateCommunity(data: CommunityInput, communityId: string, user: User) {
        const community = await this.getCommunity(communityId)

        if(!CommunityPolicy.canEdit(user, community)){
            throw new Error('No tienes permisos pare actualizar esta comunidad ')
        }
        await this.communityRepository.update(data, communityId)
    }

    async deleteCommunity(communityId: string, password: string, user: User) {
        // obtener communidad
        const community = await this.getCommunity(communityId)

        //Revisar permisos
        if(!CommunityPolicy.canDelete(user, community)){
            throw new Error('No tienes permiso para eliminar esta communidad')
        }
        // verificar password
        const isValidPassword = await checkPassword(password)
            if(!community.image) return
            if(!isValidPassword) {
            return {
                error: 'El password es incorrecto',
                success: ''
            }
        }
        // Eliminar
        await this.communityRepository.delete(communityId)
        await deleteUTFiles(community.image)
        return {
            error: '',
            success: 'Comunidad Eliminada correctamente'
        }

    }

    async getUpcomingMeetisByCommunity(communityId: string) {
        return await this.meetiRepository.findUpcomingByCommunity(communityId)
    }

    async getFeaturedCommunities() {
        return this.communityRepository.findFeatured()
    }
    async searchCommunityByTopic(query: string) {
        const communities = this.communityRepository.search(query)
        return communities
    }
}

export const communityService = new CommunityService(communityRepository,
             membershipRepository,
              meetiRepository,
              profileRepository,
            )