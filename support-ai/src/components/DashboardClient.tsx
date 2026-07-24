'use client'
import axios from 'axios'
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation'

function DashboardClient({ ownerId }: { ownerId: string }) {

    const navigate = useRouter()
    const [businessName, setBusinessName]=useState("")
    const [supportEmail, setSupportEmail]=useState("")
    const [knowledge, setKnowledge]=useState("")
    const [loading, setLoading]=useState(false)

    const handleSettings= async()=>{
        setLoading(true)
        try{
            const result = await axios.post("/api/settings", {ownerId, businessName, supportEmail, knowledge})
            console.log(result.data)
            setLoading(false)
        } catch (error){
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-zinc50 text-zinc-900'>
            <motion.div
                // this is a nav bar 
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='text-lg font-semibold tracking-tight' onClick={() => navigate.push("/")} >Support <span className='text-zinc-400'>Ai</span></div>
                    <button className='px-3 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition'  >Embed ChatBot</button>

                </div>
            </motion.div>

            <div className='flex justify-center px-4 py-15 mt-18'>
                <motion.div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10'>
                    <div className='mb-10 ' >
                        <h1 className='text-2xl font-semibold'>ChatBot Settings</h1>
                        <p className='text-zinc-500 mt-1'>Manage your AI chatbot knowledge and business details.</p>
                    </div>
                    <div className='mb-10'>
                        <h1 className='text-lg font-medium mb-4'>Business Details</h1>
                        <div className='space-y-4'>
                            <input type="text" className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm
                            focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='Business Name' value={businessName} onChange={(e)=>setBusinessName(e.target.value)}/>
                            <input type="text" className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm
                            focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='Support Email' value={supportEmail}  onChange={(e)=>setSupportEmail(e.target.value)}/>
                        </div>
                    </div>


                    <div className='mb-6'>
                        <h1 className='text-lg font-medium mb-4'>Knowledge Base </h1>
                        <p className='text-sm text-zinc-500 mb-4'  >Add FAQS, policies, delievery info, services, etc.</p>
                        <div className='space-y-4'>
                            <textarea  className='w-full h-55 rounded-xl border border-zinc-300 px-4 py-3 text-sm
                            focus:outline-none focus:ring-2 focus:ring-black/80' 
                            placeholder={
                            `Example:
We typically respond within 1 business day.
Schedule a call directly with our advisory team.
Mon–Fri, 9:00 AM – 6:00 PM IST / CET.
GDPR-compliant — your information is never shared with third parties.`} onChange={(e)=>setKnowledge(e.target.value)} value={knowledge}/>
                        </div>  
                    </div>


<div className='   flex items-center gap-5'>
    <motion.button
    whileHover={{scale: 1.03}}
    whileTap={{scale:0.97}}
    disabled={loading}
    onClick={handleSettings}
    className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium
    hover:bg-zinc-800 transistion disabled:opacity-60"
    >
        {loading?"Saving...":"Save"}
    </motion.button>
</div>


                </motion.div>
            </div>
        </div>
    )
}

export default DashboardClient