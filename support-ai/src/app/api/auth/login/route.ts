import { scalekit } from "@/lib/scalekit";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    const url = scalekit.getAuthorizationUrl(redirectUri)
    console.log(url)
}



