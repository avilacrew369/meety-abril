import { auth } from "@/src/lib/auth";
import { ProfileInput } from "../schemas/profileSchema";
import { IProfileRepository, profileRepository } from "./ProfileRepository";
import { headers } from "next/headers";

class ProfileService {
    constructor(
        private profileRepository: IProfileRepository
    ){}

    async getProfileDetails(profileId: string) {
        return await this.profileRepository.findFullProfileById(profileId)
    }

    async updateProfile(data: ProfileInput) {
        const { name, image } = data
        await auth.api.updateUser({
            body: {
                name,
                image,
            },
            headers: await headers()
        })
    }

}

export const profileService = new ProfileService(profileRepository)