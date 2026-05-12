import { tool } from "ai";
import z from "zod";
import { meetiService } from "../../meetis/services/MeetiService";

export const meetiTools = {
    getMeetisBySubject: tool({
        description: 'Recomienda Meetis cuando el usuario busque o te pregunte un meeti sobre un tema en especifico',
        inputSchema: z.object({
            query: z.string().describe('Tema de interes del Meeti')
        }),
        execute: async ({ query }) => {
            const meetis = await meetiService.getMeetisByTopic(query)

            if (!meetis.length) {
                return {
                    meetis: [],
                    totalFound: 0,
                    message: `No encontre meetis relacionados con ${query} Quieres intentar otra busqueda? `
                }
            }
            return {
                meetis,
                totalFound: meetis.length
            }
        }
    }),
    getVirtualMeetis: tool({
        description: `
            Usa esta herramienta cuando el usuario pregunta por meetis o eventos virtuales.
            - Si menciona un tema (React, IA, Marqueting, Bitcoin, cafe, etc), pasalo al query.
            - Si menciona "hoy" pasalo al query
            - si el usuario pregunta por meetis virtules, query debe ir vacio
        `,
        inputSchema: z.object({
            query: z.string().optional().describe('Tema de interes del usuario sobre el meeti o evento')

    }),
    execute: async ({query}) => {
        const meetis = await meetiService.getVirtualsMeetis(query)

          if (!meetis.length) {
                return {
                    meetis: [],
                    totalFound: 0,
                    message: `No encontre meetis relacionados con ${query} que sean virtuales,  Quieres intentar otra busqueda? `
                }
            }

            return {
                meetis,
                totalFound: meetis.length
            }

    }

    }),
    getInPersonMeetis: tool({
        description: `Usa esta herramienta cuando el usuario pregunte por eventos presenciales. 
            reglas:
            - Si el usuario menciona una ciudad, incluyela en 'city'.
            - Si el usuario menciano un pais, incluyelo en 'country'.
            - Si menciona un tema (React, Bitcoin, MKT, IA, Cafe), incluyelo dentro de 'query'
            - Si el usuario menciona hoy, pon 'today' como true.
            `,
        inputSchema: z.object({
            query: z.string().optional().describe('Tema de interes del Meeti o evento del usuario'),
            city: z.string().optional().describe('ciudad del Meeti de interes del usuario'),
            country: z.string().optional().describe('pais del Meeti de interes del usuario'),
            today: z.boolean().default(false).describe('El usuario desea un Meeti o evento hoy')


        }),
        execute: async({query, city, country, today}) => {
              const meetis = await meetiService.getInPersonMeetis(query, city, country, today)

          if (!meetis.length) {
                return {
                    meetis: [],
                    totalFound: 0,
                    message: `No encontre meetis ${query ? `relacionados con ${query}` : ''} En esta ubicacion,  Quieres intentar otra busqueda? `
                }
            }

            return {
                meetis,
                totalFound: meetis.length
            }
        }
    })

}