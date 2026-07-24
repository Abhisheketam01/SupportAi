import Settings from "@/model/settings.model";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req:NextRequest){

    try{
        const {message, ownerId } =  await req.json()
        if(!message || !ownerId){
            return NextResponse.json(
                {message:"message and owner id is require"},
                {status:400}
            )
        }

        const setting = await Settings.findOne({ownerId})
        if(!setting){
            return NextResponse.json(
                {message:"Chat bot is not configured yet"},
                {status:400}
            )
        }

        const KNOWLEDGE=`
        
        `
        
        const prompt =  `
        You are a professional customer support assistant for this business.

        Use ONLY the information provided below to answer the customer's question.
        You may rephrase, summarize, or interpret the information if needed.
        Do NOT invent new policies, prices, or promises.

        If the customer's question is completely unrelated to the information,
        or cannot be reasonably answered from it, reply exactly with:
        "Please contact support."

        -------------------------
        BUSINESS INFORMATION
        -------------------------
        ${KNOWLEDGE}

        --------------------------
        CUSTOMER QUESTION
        --------------------------
        ${message}

        --------------------------
        ANSWER
        --------------------------
        `;
    } catch(error){

    }
}