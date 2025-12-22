import React from 'react'
import Hero from '../components/Layout/Hero'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'

function Home() {
  return (
    <>
    <Hero />
    <NewArrivals />

    {/* Featured Products */}
    <h2 className="text-3xl text-center font-bold mb-4">Featured Products</h2>
    <ProductDetails />
    </>
  )
}

export default Home