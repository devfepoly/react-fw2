import React from 'react'
import { Outlet } from 'react-router-dom'
import HomeHeader from './_components/layout/HomeHeader'
import HomeFooter from './_components/layout/HomeFooter'

export default function HomeTemplate({ isDark, toggleTheme }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
            <HomeHeader isDark={isDark} toggleTheme={toggleTheme} />
            <main className="flex-1 mt-[140px] md:mt-[130px]">
                <Outlet />
            </main>
            <HomeFooter />
        </div>
    )
}
