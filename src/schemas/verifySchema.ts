import {z} from 'zod'

// we are verifying user on the basic of verification verifyCode
export const verifySchema = z.object({
    code: z
        .string()
        .length(6, "verification code must be 6 digits")
})