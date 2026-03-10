import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import Hero from '../components/Layout/Hero'
import NewArrivals from '../components/Products/NewArrivals'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Optionally filter some products for new arrivals
  const newArrivalsList = products?.slice(0, 8) || [];

  return (
    <>
    <Hero />
    <NewArrivals products={newArrivalsList} loading={loading} />
    <FeaturedCollection />
    <FeaturesSection />
    </>
  )
}

export default Home