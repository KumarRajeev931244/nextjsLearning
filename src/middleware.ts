import { NextResponse, NextRequest } from 'next/server'
export { default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
 

export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})

    // give current url
    
    const url = request.nextUrl
    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )
    ){
        return NextResponse.redirect(new URL('/home', request.url))
    }
}
 

// this config vaha use hota kaha-kaha hum middleware ko use karna chahtye hai.
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}