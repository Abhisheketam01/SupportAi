import DashboardClient from '@/components/DashboardClient'
import { getSession } from '@/lib/getSession'
import React from 'react'

async function page(){
    const session = await getSession()
    return (
        <>
            <DashboardClient ownerId={session?.user?.id!}/>
        </>
    )
}

export default page

{/*  The logic here is simple -
we can only see dashboard when we 
are logged in , else you wont see dashboard , 
so for that i have to set up a 
middleware called proxy inside this project
*/}