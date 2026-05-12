import { tool } from "ai"
import z from "zod"
import { communityService } from "../../communities/services/CommunityService"

export const communityTools = {
   getRecommendedCommunities: tool({
    description: 'Recomienda comunidades cuando el usuario busque o te pregunte una comunidad sobre un tema en especifico',
    inputSchema: z.object({
        query: z.string().describe('Tema de interes del usuario')
    }),
    execute: async ({query}) => {
        const communities = await communityService.searchCommunityByTopic(query)

        if(!communities.length){
            return {
                communities: [],
                totalFound: 0,
                message: `No encontre communidades relacionades con ${query} Quieres intentar otra busqueda? `
            }
        }

        return {
            communities,
            totalFound: communities.length
        }
    }
   })
}