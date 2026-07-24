import connectDB from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        const {ownerId} = await req.json()
        if(!ownerId){
            return NextResponse.json(
                {message:"owner id is require"},
                {status:400}
            )
        }
        await connectDB()
        const setting = await Settings.findOne(
            {ownerId}
        )
        return NextResponse.json(setting)
    } catch(error){
        return NextResponse.json(
            {messagw:`get setting error ${error}`},
            {status:500}
        )
    }
}