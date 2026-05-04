import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getImageUrl } from '../../utils/getImageUrl';

function NewArrivals({ products = [], loading = false }) {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);


    // Mouse Down Event
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;  
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // function to call when scroll buttons are clicked
    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    // Handle Scroll
    const handleScroll = () => {
        const scrollContainer = scrollRef.current;
        if(scrollContainer){
            const leftScroll = scrollContainer.scrollLeft;
            const rightScroll = scrollContainer.scrollWidth > leftScroll + scrollContainer.clientWidth;
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScroll);
        }
    }

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if(scrollContainer){
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll); // Cleanup
            }
        }
    },[])

  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto text-center mb-10 relative'>
            <h2 className="text-3xl font-bold mb-4 mt-4">Explore New Arrivals</h2>
            <p className='text-lg text-gray-600 mb-8'>Discover our latest collection of handcrafted crochet items.</p>

            {/* Scroll Button */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FiChevronLeft className='text-2xl'/>
                </button>
                <button 
                disabled={!canScrollRight}
                onClick={() => scroll('right')}
                className={`bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FiChevronRight className='text-2xl'/>
                </button>
            </div>
        </div>

        {/* Scrollable content */}
        <div 
        ref={scrollRef} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseLeave}
        onMouseLeave={handleMouseLeave}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab' }`}>
            {loading ? ( <p className="text-center w-full py-10">Loading Products...</p> ) : products.map((product) => (
                <div key={product._id} 
                className="min-w-[90%] sm:min-w-[48%] lg:min-w-[30%] relative ">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-[4/5] overflow-hidden">
                          <img 
                            src={getImageUrl(product.image || product.images?.[0]?.url)} 
                            alt={product.name} 
                            draggable="false"
                            className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-75 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className='block'>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="mt-1"> ₹ {product.price}</p>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

export default NewArrivals;