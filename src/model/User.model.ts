import mongoose, {Schema, Document} from "mongoose";


// first we define interface and then we define the Schema.
export interface Message extends Document{
    content: string; // 's' should be small
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// we define the user interface and we define userSchema 

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;                 //otp
    verifyCodeExpiry: Date;             //when otp expire
    isVerified: boolean;                
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'please use a valid email address']
    },
    password:{
        type: String,
        required: [true, "password is required"]
    },
    verifyCode:{
        type: String,
        required: [true, "verify code is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "verify code expiry is required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

// typeScript work on edge cases agar phele se bana ho use kar lo aur nahi bana ho toh bana lo.
// hot-reloading or in serverless environments where the code might be evaluated multiple times without a full server restart.

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema) 

export default UserModel