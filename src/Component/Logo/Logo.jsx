import React from 'react'
import LogoPng from '../../Images/Logo.png' // Adjust the path as necessary
export const Logo = () => {
  return (
    <div>
      <img src={LogoPng} alt="Logo" className='w-10 h-10' />
    </div>
  )
}
