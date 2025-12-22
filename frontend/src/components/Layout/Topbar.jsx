import { Instagram, MessageCircle, Zap } from 'lucide-react'
import React from 'react'

const Topbar = () => {
  return (
    <div className='bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white'>
        <div className='container mx-auto flex justify-between items-center py-2 px-4'>
            <div className='hidden md:flex items-center space-x-4'>
                <a href="#" className='hover:text-gray-300'>
                    <Zap className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <MessageCircle className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <Instagram className='h-5 w-5'/>
                </a>
            </div>
            <div className='text-sm text-center flex-grow'>
                <span>Karigari By Nisha Khitoliya | Crochet Artist </span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href="tel:+917803963389" className='hover:text-gray-300'>+91 7803963389</a>
            </div>
        </div>
    </div>
  )
}

export default Topbar