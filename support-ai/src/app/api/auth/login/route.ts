import { scalekit } from "@/lib/scalekit";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    const url = scalekit.getAuthorizationUrl(redirectUri)
    console.log(url)
    return NextResponse.redirect(url)
}



/*
The Big Picture First

This is a Next.js API route that kicks off a login flow using something called Scalekit (an authentication service — think of it as a company that handles "login" for you, so you don't build that from scratch).

The entire job of this file: when someone hits this URL in your app, it redirects them to a login page (hosted by Scalekit), and tells that login page "once you're done, send the user back to this specific address in my app."

That's it. It's a traffic redirector, not the actual login logic itself.

Now Line by Line
typescript
import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";
First line: importing a pre-configured connection to Scalekit (someone already set this up elsewhere in the project, in a file at lib/scalekit).
Second line: importing Next.js's built-in tools for handling web requests (NextRequest) and sending responses (NextResponse).
typescript
export async function GET(req: NextRequest) {

This defines what happens when someone makes a GET request to this route. In Next.js's "App Router" system (the modern way of building Next.js apps), if you name a function GET inside a file called route.ts, Next.js automatically wires it up — no manual routing code needed. So if this file lives at app/api/auth/login/route.ts, visiting yoursite.com/api/auth/login in a browser triggers this function.

typescript
const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`

This builds a URL string. process.env.NEXT_PUBLIC_APP_URL pulls your app's base URL from an environment variable (like https://myapp.com, stored in a .env file so it's not hardcoded — smart practice, since it changes between your local machine, staging, and production).

So this becomes something like:
https://myapp.com/api/auth/callback

This is the address Scalekit will send the user back to once they've logged in successfully. It's called a callback URL — a very standard concept in any OAuth/login flow.

typescript
const url = scalekit.getAuthorizationUrl(redirectUri)

This asks the Scalekit library: "Hey, build me the actual login page URL, and remember to send the user back to my callback address once they're done." Scalekit hands back a full URL (something like https://auth.scalekit.com/login?client_id=xyz&redirect_uri=...).

typescript
console.log(url)

Just a debug line — prints that URL to your server logs so the developer can see what's being generated. Totally normal during development; you'd usually remove this before shipping to production (logging URLs with tokens/secrets in them is a bad habit to carry into production code).

typescript
return NextResponse.redirect(url)

This is the actual action: it tells the browser "stop, go to this URL instead" — the user gets bounced from your app straight to Scalekit's hosted login page.

Why This Pattern Exists (the "why" you asked for)

This is a textbook implementation of the OAuth-style "redirect to a hosted login page" flow, used by literally every "Login with Google/GitHub/Microsoft" button you've ever clicked. The reasoning:

You don't want to handle passwords yourself. Storing passwords securely is genuinely hard and risky — one mistake and you leak user credentials. Companies like Scalekit specialize in doing this safely, so app developers offload that risk.
The flow always has two halves: this file (the "go log in" trigger) and a matching callback route (the "okay, you're back, here's your session" handler) — which is what /api/auth/callback in the code would separately handle.
Environment variables (NEXT_PUBLIC_APP_URL) keep the code portable — same code works whether you're running on your laptop or a live server.
*/