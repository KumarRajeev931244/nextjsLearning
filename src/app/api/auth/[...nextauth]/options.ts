import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnent";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
    // defining credentials
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    // finding the user in the database on the basis of email or username
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    })

                    // if user is not found then throw error
                    if(!user){
                        throw new Error('no user found with this email or username')
                    }

                    // if user is found then check it is verified or not
                    if(!user.isVerified){
                        throw new Error('Please verify your account before login')
                    }
                    // if user is verified then check the password is correct or not
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    // if password is correct then return the user
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("incorrect password")
                    }

                } catch (error: any) {
                    throw new Error(error)               
                }
            }
        })
    ],


    // defining callback
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username
            }
            return session
        },
        // yeha par user jo parameter hai voh jo return kiya hai.
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        }
    },


    // defining route for pages.
    pages: {
        signIn: '/sign-in'
    },

    // it is used on which basic where can sign-in
    session:{
        strategy: 'jwt'
    },

    
    // it is mandatory to give scret
    secret: process.env.NEXTAUTH_SECRET
}