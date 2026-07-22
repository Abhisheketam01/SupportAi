import { cookies } from "next/headers";

export async function getSession(){
    const session = await cookies()


}