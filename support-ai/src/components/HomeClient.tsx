'use client'
import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

function HomeClient({ email }: { email: string }) {
    const handleLogin = () => {
        window.location.href = "/api/auth/login"
    }
    const firstLetter = email ? email[0].toUpperCase() : ''
    const [open, setOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node))
                setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])
    return (
        <div className='min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden'>
            {/* this is nav section , nav => hero => footer */}
            <motion.div
                // this is a nav bar 
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='text-lg font-semibold tracking-tight'>Support <span className='text-zinc-400'>Ai</span></div>
                    {email ? <div className='relative' ref={popupRef} >
                        <button className='w-10 h-10 rounded-full 
                        bg-black text-white
                        flex items-center justify-center
                        font-semibold
                        hover:scale-105 transition'
                            onClick={() => setOpen(!open)}
                        >{firstLetter}</button>

                        <AnimatePresence>
                            {open && (
                                // when we login then we see 2 option after hovering it 1>dshboard and 2>logout
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className='absolute right-0 mt-3 w-44
                                    bg-white rounded-xl
                                    shadow-xl border border-zinc-200
                                    overflow-hidden'
                                >
                                    <button className='w-full text-left px-4 py-3 text-sm font-semibold
                                hover:bg-zinc-100'>Dashboard</button>
                                    <button className='block px-4 py-3 text-sm text-red-600 font-semibold hover:bg-zinc-100'>Logout</button>

                                </motion.div>)}
                        </AnimatePresence>

                    </div> :
                        <button // this is login button
                            className='px-5 py-2 rounded-full
                    bg-black text-white text-sm font-medium
                    hover:bg-zinc-800 transition
                    disabled:opacity-60
                    flex items-center gap-2'
                            onClick={handleLogin}
                        >Login</button>}
                </div>
            </motion.div>
            <section className='pt-36 pb-28 px-6'>
                {/* left wala div*/}
                <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center'>
                    {/* this is hero section  - hero section contains 2 div here , left div and right div */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className='text-4xl md:test-5xl font-semibold leading-tight'>
                            AI Coustomer Support <br />
                            Build for Modern websites
                        </h1>
                        <p className='mt-6 text-lg text-zinc-600 max-w-xl'>
                            Add powerful AI chatbot to your website in minutes.
                            Let your coustomer get instant answers using your own business Knowledge.
                        </p>
                        <div className='mt-10 flex gap-4'>
                            {email?<button className='px-7 py-3 rounded-xl 
                        bg-black text-white font-medium
                        hover:bg-zinc-800 transition disabled:opacity-60'>Go to Dashboard</button>:<button className='px-7 py-3 rounded-xl 
                        bg-black text-white font-medium
                        hover:bg-zinc-800 transition disabled:opacity-60'
                        onClick={handleLogin}
                        >Get Started</button>}
                            <button className='px-7 py-3 rounded-xl border
                        border-zinc-400
                        text-zinc-700
                        hover:bg-zinc-100 transition
                        ' >Learn More</button>
                        </div>
                    </motion.div>
                    <div>
                    </div>
                </div>
                {/* right wala div*/}
            </section>
        </div>
    )
}

export default HomeClient
