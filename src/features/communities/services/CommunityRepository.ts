import { db } from "@/src/db"
import { CommunityWithMembersCount, InserCommunity, SelectCommunity } from "../types/community.types"
import { community, communityMembers, } from "@/src/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { CommunityInput } from "../schemas/communitySchema"
import { number } from "zod"

export interface ICommunityRepository {
    create(data: InserCommunity): Promise<SelectCommunity>
    findByUser(userId: string, limit?: number): Promise<SelectCommunity[]>
    findById(communityId: string): Promise<SelectCommunity | undefined>
    update(data: CommunityInput, communityId: string): Promise<void>
    delete(communityId: string): Promise<void>
    findFeatured(): Promise<CommunityWithMembersCount[]>
    search(query: string) : Promise<SelectCommunity[]>
}

class CommunityRepository implements ICommunityRepository {
    async create(data: InserCommunity) {

        const [result] = await db.insert(community).values(data).returning()
        return result
    }

    async findByUser(userId: string, limit = 10): Promise<SelectCommunity[]> {
        const communities = await db
            .select()
            .from(community)
            .where(eq(community.creteBy, userId))
            .limit(limit)
        return communities
    }

    async findById(communityId: string): Promise<SelectCommunity | undefined> {
        const [result] = await db
            .select()
            .from(community)
            .where(eq(community.id, communityId))
            .limit(1)
        return result
    }

    async update(data: CommunityInput, communityId: string) {
        await db.update(community).set({
            ...data
        }).where(eq(community.id, communityId))
    }

    async delete(communityId: string): Promise<void> {
        await db.delete(community).where(eq(community.id, communityId))
    }

    async findFeatured(): Promise<CommunityWithMembersCount[]> {
        const membersCount = sql<string> `(
            SELECT COUNT(*)
            FROM ${communityMembers}
            WHERE ${communityMembers.communityId} = ${community.id}
       )`
        const result = await db
            .select({
                id: community.id,
                name: community.name,
                description: community.description,
                image: community.image,
                membersCount: membersCount

            })
            .from(community)
            .orderBy(desc(membersCount))
            .limit(3)



        return result

    }

    async search(query: string): Promise<SelectCommunity[]> {
        return await db.query.community.findMany({
            where: {
                OR: [
                    {
                        name: {
                            ilike: `%${query}%`
                        }
                    },
                    {
                          description: {
                            ilike: `%${query}%`
                        }
                    }
                ]
            }
        })
    }
}

export const communityRepository = new CommunityRepository()