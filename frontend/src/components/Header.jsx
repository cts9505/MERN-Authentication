import React from 'react'
import{assets} from '../assets/assets'
const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-700'>
      <img src={assets.header_img} className='w-36 h-36 rounnded-full mb-6'/>
      <h1 className='flex items-center gap-2 justify-center text-xl sm:text-3x1 font-medium mb-2'>Hey Develpers<img className="w-8 aspect-square" src={assets.hand_wave}/> </h1>
      <h2 className='text-lg sm:text-xl font-light'>Welcome to the world of code</h2>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>Get Started</button>
    </div>
  )
}

export default Header
