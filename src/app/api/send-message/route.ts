import dbConnect from "@/lib/dbConnent";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request){
    await dbConnect()

    // message koi bhi bhej sakta hai esliye check karne ki neccessary nahi hai ki user logged in hai ya nahi.

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findByIdAndUpdate({username})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'user not found'
                },
                { status: 401}
            ) 
        }

        // is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: 'user not accepting the messages'
                },
                { status: 403}
            )
        }

        // new message is created
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                success: true,
                message: 'message sent successfully'
            },
            { status: 200}
        )
    } catch (error) {
        console.log("error adding messages:", error);
        
        return Response.json(
            {
                success: false,
                message: 'internal server error'
            },
            { status: 500}
        )
        
    }
}