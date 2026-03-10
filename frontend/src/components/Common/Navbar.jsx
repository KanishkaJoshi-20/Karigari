import { ShoppingBag, User, X, Menu } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'

const navLinkClass = `text-gray-700 text-sm font-medium uppercase 
  px-3 py-0.5 rounded-md 
  transition-all duration-200
  hover:text-black hover:bg-white hover:shadow-md`;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/* Left logo */}
        <div>
          <Link to='/' className='text-2xl font-medium'>Karigari</Link>
        </div>

        {/* Center nav links */}
        <div className='hidden md:flex space-x-6'>
          <Link to='/' className={navLinkClass}>Home</Link>
          <Link to='/collections/all' className={navLinkClass}>Collections</Link>
          <Link to='/custom-crochet' className={navLinkClass}>Custom Crochet</Link>
          <Link to='/about' className={navLinkClass}>About Us</Link>
          <Link to='/contact' className={navLinkClass}>Contact Us</Link>
          {user && user.isAdmin && (
            <Link to='/admin' className={navLinkClass}>Admin</Link>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <Link to={user ? '/profile' : '/login'} className='hover:text-black'>
            <User className='h-6 w-6 text-gray-700' />
          </Link>
          <button onClick={toggleCartDrawer} className='relative hover:text-black'>
            <ShoppingBag className='h-6 w-6 text-gray-700' />
            {cartCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none'>
                {cartCount}
              </span>
            )}
          </button>
          <SearchBar />
          <button onClick={toggleNavDrawer} className='md:hidden'>
            <Menu className='h-6 w-6 text-gray-700' />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile navigation */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        navDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <X className='h-6 w-6 text-gray-600' />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className='space-y-4'>
            <Link to='/' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Home</Link>
            <Link to='/collections/all' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Collections</Link>
            <Link to='/custom-crochet' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Custom Crochet</Link>
            <Link to='/about' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>About Us</Link>
            <Link to='/contact' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Contact Us</Link>
            {user && user.isAdmin && (
              <Link to='/admin' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black font-semibold'>Admin Panel</Link>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar