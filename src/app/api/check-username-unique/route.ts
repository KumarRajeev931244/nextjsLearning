import {z} from 'zod'
import UserModel from '@/model/User.model'
import dbConnect from '@/lib/dbConnent'
import { usernameValidation } from '@/schemas/signUpSchema'


// validation of username is checked
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        // here we are retriving the username from the searchParam 
        
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); //TODO: remove

        // agar result mae error mil raha ho toh
        if(!result.success){
            const  usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(',') :"Invalid query parameters"
                },
                {status: 400}
            )
        }
        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "username is already taken",
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: 'username is unique',

        },{status: 400})
        
    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )
        
        
    }
}

