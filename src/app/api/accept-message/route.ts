import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnent";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User
    
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
        { status: 401}
    )
    }
    const userId = user._id;
    const {acceptMessages} = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                {status: 401}
            )

        }
        return Response.json(
                {
                    success: true,
                    message: "message acceptance status updated successfully",
                    updatedUser
                },
                {status: 200}
            )
    } catch (error) {
        console.log("failed to update the user status to accept message");
        return Response.json(
            {
                success: false,
                message: "failed to update the user status to accept message"
            },
            {status: 500}
        )
        
        
    }
}

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {status: 401}
        )
    }
    const userId = user._id;
    const foundUser = await UserModel.findById(userId)
    try {
        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status: 404}
            )
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        },
        {status: 200}
    )
    } catch (error) {
        console.log("failed to update the user status to accept message");
        return Response.json(
            {
                success: false,
                message: "error in getting message acceptance"
            },
            {status: 500}
        )
        
    }
}