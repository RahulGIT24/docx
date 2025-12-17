import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });

    const { pathname, searchParams } = request.nextUrl;
    const publicPaths = [
        '/login',
    ];

    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next|api|static).*)',
    ],
};