import React from 'react'
import { useApp } from "../ContextProvider/AppContext";


const NavBar = () => {
    const {setPage}=useApp();
  return (
    <nav className='flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200'>
      <span className='text-xl font-bold text-blue-700'>VoxPopuli</span>

      <div className='flex items-center gap-3'>
        <button className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors' type="button"  onClick={() => setPage("Login")}>
          Log In
        </button>
        <button className='px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors' type="button"  onClick={() => setPage("SignUp")}>
          Sign Up
        </button>
      </div>
    </nav>
  )
}

export default NavBar