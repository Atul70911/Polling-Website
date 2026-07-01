import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-100 border-t border-gray-200 px-8 py-6'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='font-bold text-gray-900'>VoxPopuli</p>
          <p className='text-sm text-gray-500 mt-1'>© 2024 VoxPopuli Polling Systems. All rights reserved.</p>
        </div>

        <div className='flex items-center gap-6'>
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us", "FAQ"].map((item) => (
            <a key={item} href='#' className='text-sm text-gray-600 underline hover:text-blue-700 transition-colors'>
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer