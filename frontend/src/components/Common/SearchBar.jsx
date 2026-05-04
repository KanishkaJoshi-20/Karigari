import { Search, X } from 'lucide-react';
import React, { useState } from 'react'

const SearchBar = () => {
    const[searchTerm, setSearchTerm] = useState('');
    const[isOpen, setIsOpen] = useState(false);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    }

    const handleSearch = (e) =>{
        e.preventDefault();
        console.log('Search Term:', searchTerm);
        setIsOpen(false);
    }
  return (
    <div className={`flex items-center justify-center transition-all duration-300 ${isOpen ? 'fixed inset-x-0 top-0 z-50 bg-white p-4 shadow-lg' : 'w-auto'}`}>
        {isOpen ? (
            <form 
             className='relative w-full max-w-xl mx-auto' 
             onSubmit={handleSearch}>
              <input 
                type='text' 
                name='search' 
                placeholder='Search' 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full bg-gray-100 px-4 py-3 rounded-full focus:outline-none shadow-sm placeholder:text-gray-700'/>
            
            <button type='submit' className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
                <Search className='h-6 w-6'/>
            </button>
            <button type='button' 
            onClick={handleSearchToggle}
            className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
                <X className='h-6 w-6'/>
            </button>
        </form>) : (
            <button onClick={handleSearchToggle}>
                <Search className='h-6 w-6'/>
            </button>
        )}
    </div>
  )
}

export default SearchBar