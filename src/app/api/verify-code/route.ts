import dbConnect from "@/lib/dbConnent";
import UserModel from "@/model/User.model";

export async function Post(request: Request){
    await dbConnect()
    try {
        const {username, code} = await request.json()
        // it convert the encoded url into original form and decodedURIComponent is js function
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        // agar user exist nahi karta hai
        if(!user){
            return Response.json(
                {
                    success:false,
                    message: "user not found"
                },
                {status: 500}
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "account verified successfully"
            }, {status: 200})

        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "verification code has expired, please signup again to get a new code"
            },
        {
            status: 400
        }
    )
        }
        
    } catch (error) {
        console.error("error verifying user:", error);
        return Response.json(
            {
                success: false,
                message: "error verifying user"
            },
            {status: 500}
        )
        
        
    }
}