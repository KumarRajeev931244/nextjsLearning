import {z} from 'zod'

export const signInSchema = z.object({
    // identifier is just varible
    identifier: z.string(),
    password: z.string()
})