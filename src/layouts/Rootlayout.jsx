import React from 'react'
import { Outlet } from 'react-router'

export const Rootlayout = () => {
  return (
    <div>
        <Outlet></Outlet>
    </div>
  )
}
