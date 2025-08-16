import {NextResponse} from "next/server";

export default async function middleware(req) {
    console.log("entering middleware")
    const token = req.cookies.get("token")?.value
    const {pathname} = req.nextUrl;

    if (pathname === "/auth" || pathname == "/" || pathname.startsWith("/api")) {
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL('/auth', req.url))
    }

    console.log("token there")

}

export const config = {
    matcher: ["/app/:path*"]
}
