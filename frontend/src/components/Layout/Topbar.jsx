import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import React from 'react'

const Topbar = () => {
  return (
    <div className='bg-[#2A2420] text-white/80 text-xs'>
      <div className='container mx-auto flex justify-between items-center py-2 px-6'>
        {/* Left: social icons */}
        <div className='flex items-center gap-3'>
          <a
            href="https://instagram.com/karigari.crochet"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-white transition-colors'
            aria-label="Instagram"
          >
            <FaInstagram className='h-3.5 w-3.5' />
          </a>
          <a
            href="https://wa.me/917803963389"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-white transition-colors'
            aria-label="WhatsApp"
          >
            <FaWhatsapp className='h-3.5 w-3.5' />
          </a>
        </div>

        {/* Center: brand tagline */}
        <span className='text-center tracking-wide text-white/70'>
          Karigari By Nisha Khitoliya &nbsp;·&nbsp; Handcrafted Crochet
        </span>

        {/* Right: phone */}
        <a
          href="tel:+917803963389"
          className='hover:text-white transition-colors hidden md:block'
        >
          +91 7803963389
        </a>
      </div>
    </div>
  )
}

export default Topbar