import dbConnect from "@/lib/dbConnent";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User.model";

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "not authneticated"
        },
        {status: 401}
    
    )
    }
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        // TODO: console the user 
        const user = await UserModel.aggregate([
            // first match then  i will do unwind, sort the record and do group.
            { $match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$id', messages: {$push: '$messages'}}}
        ])

        // agar user na mile ya phir empty ho
        if(!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: 'user not found'
                },
                { status: 401}
            )

        }
        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {status: 401}
        )
    } catch (error) {
        console.log("an unexpected error occured:", error);
        
        return Response.json(
            {
                success: false,
                message: 'not authenticated'
            },
            { status: 500}
        )
        
        
    }
}