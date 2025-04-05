import {z} from 'zod'

/**here we have to check single element so we donot use object keyword. */
export const usernameValidation = z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(20, "username must not be more than 20 characters")
    .regex( /^[a-zA-Z0-9_-]+$/, "username must not contain special characters")


/** here we have to check multiple element so we have to use object. 
 * 
 * for sign-up we are taking three element from user i.e username, email, password
*/
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z
        .string()
        .email({message: "invalid email address"}),
    password: z
        .string()
        .min(6, {message: "password must be atleast 6 character"})
})