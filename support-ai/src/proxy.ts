import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSession";

export async function proxy(req:NextRequest){
    const session = await getSession()
    if(!session){
        // this is checkinng by Middleware that says if you have session log in - you can move to dashboard else youll be redirected to homepage
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
    }
    return NextResponse.next();
}

export const config = {
    // using this we are telling proxy to run only for this path called dashboard
    matcher: '/dashboard/:path*',
}