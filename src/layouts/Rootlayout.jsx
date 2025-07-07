import React from 'react'
import { Outlet } from 'react-router'
import Navber from '../pages/Home/Navbar'
import Footer from '../pages/Home/Footer'

export const Rootlayout = () => {
  return (
    <div>
        <Navber></Navber>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}
