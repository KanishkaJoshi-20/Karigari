import { X } from 'lucide-react';
import React, { useState } from 'react'
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    const handlecheckout = () => {
        toggleCartDrawer();
        navigate('/checkout');
    }

    return (
        <AnimatePresence>
            {drawerOpen && (
                <>
                    {/* Frosted Glass Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCartDrawer}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Drawer Body */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 w-[85%] sm:w-1/2 md:w-[32rem] h-full bg-white shadow-2xl flex flex-col z-50"
                    >
                        {/* close button */}
                        <div className='flex justify-end p-4 border-b border-gray-100'>
                            <button onClick={toggleCartDrawer} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className='h-5 w-5 text-gray-600' />
                            </button>
                        </div>

                        {/* cART CONTENT */}
                        <div className="grow p-6 overflow-y-auto">
                            <h2 className="text-2xl font-medium tracking-tight mb-6">Your Cart</h2>
                            <CartContents />
                        </div>

                        {/* Checkout button fix at bottom */}
                        <div className='p-6 bg-white sticky bottom-0 border-t border-gray-100'>
                            <button onClick={handlecheckout} className='w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20'>
                                Checkout
                            </button>
                            <p className='text-xs tracking-wide text-gray-500 mt-4 text-center'>
                                Shipping, taxes, and discount codes calculated at checkout.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CartDrawer