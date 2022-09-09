import { getToken } from 'next-auth/jwt';
import {NextResponse} from 'next/server';


export async function middleware(req : any) {
    console.log("Midddleware File", req.nextUrl);

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if(req.nextUrl.pathname.startsWith("/admin")){
        const url = req.nextUrl.origin;
    
        const validRoles = ['admin','super-user','SEO'];
    
        if ( !validRoles.includes( session.user.role ) ) {
            return NextResponse.redirect("http://localhost:3000/");
        }
    
    }
    if ( !session ) {
        const requestedPage = req.nextUrl.pathname;
        return NextResponse.redirect(`http://localhost:3000/auth/login?p=${ requestedPage }`);
    }

    return NextResponse.next();


}

export const config= {
    matcher: ["/cart/:path*", "/admin/:path*"]
}