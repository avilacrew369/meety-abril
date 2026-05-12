import { communityTools } from "./communityTools";
import { meetiTools } from "./meetitolls";

export const tools = {
    ...communityTools,
    ...meetiTools,
} as const