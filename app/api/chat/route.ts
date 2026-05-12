import { UIMessage, convertToModelMessages, streamText} from "ai";
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { NextRequest } from "next/server";
import { tools } from "@/src/features/ai/tools";

export async function POST(req: NextRequest) {
    const {messages} : {messages : UIMessage[]} = await req.json()

    const openrouter = createOpenRouter({
        apiKey: process.env.OPEN_ROUTER_KEY
    })

    const result = streamText({
        messages: await convertToModelMessages(messages),
        system: `Eres un assistente de Meeti que ayuda a encontrar comunidades y meetis`,
        model: openrouter('inclusionai/ring-2.6-1t:free'),
        tools

    })
    return result.toUIMessageStreamResponse()

}