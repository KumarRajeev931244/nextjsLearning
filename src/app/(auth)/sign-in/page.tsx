import { signIn, signOut, useSession } from "next-auth/react";
'use client'

export default function Component(){
    const {data: session} = useSession()
    if(session){
        return(
            <>
            signed in as {session.user.email} <br/>
            <button onClick={() => signOut}>sign out</button>
            </>
        )
    }
    return(
        <>
        not signed in <br/>
        <button className="bg-orange-500 px-3 py-1 m-4 rounded" onClick={() => signIn}>signIn</button>
        </>
    )
}
