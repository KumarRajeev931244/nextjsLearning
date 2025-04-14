import 'next-auth'
import { DefaultSession } from 'next-auth';


// here we are redefining the next auth module 
declare module 'next-auth'{
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
    interface Session{
        user:{
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;        
    }
}