import React from 'react'
import LogoPng from '../../Images/logo2.png' // Adjust the path as necessary
export const Logo = () => {
  return (
    <div>
      <img src={LogoPng} alt="Logo" className='w-15 h-15' />
    </div>
  )
}
