import React from 'react'
import { Outlet } from 'react-router'
import Navber from '../pages/Home/Navbar'
import Footer from '../pages/Home/Footer'
import ScrollToTop from '../Component/ScrollToTop/ScrollToTop'
import { useTheme } from '../Component/Context/ThemeContext'


export const Rootlayout = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>
        <ScrollToTop />
        <Navber></Navber>
        <main className={`transition-colors duration-300 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}>
          <Outlet></Outlet>
        </main>
        <Footer></Footer>
    </div>
  )
}
