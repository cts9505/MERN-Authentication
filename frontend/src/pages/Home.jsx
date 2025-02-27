import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen shadow-md bg-gradient-to-b from-gray-50 to bg-gray-100'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
