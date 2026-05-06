import { ShoppingBag, User, X, Menu, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'

const NAV_LINKS = [
  { to: '/',               label: 'Home' },
  { to: '/collections/all', label: 'Collections' },
  { to: '/custom-crochet', label: 'Custom Crochet' },
  { to: '/gift-builder',   label: 'Gift Builder' },
  { to: '/about',          label: 'About Us' },
  { to: '/contact',        label: 'Contact' },
]

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const location = useLocation()

  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)
  const { wishlistItems } = useSelector((state) => state.wishlist)

  useEffect(() => {
    if (drawerOpen) setDrawerOpen(false)
    if (navDrawerOpen) setNavDrawerOpen(false)
  }, [location.pathname])

  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)
  const wishlistCount = wishlistItems?.length || 0

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinkClass = (path) =>
    `relative text-sm font-medium transition-colors duration-200 pb-0.5
     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:transition-transform after:duration-200
     ${isActive(path)
       ? 'text-primary after:bg-primary after:scale-x-100'
       : 'text-slate-600 hover:text-slate-900 after:bg-primary after:scale-x-0 hover:after:scale-x-100'
     }`

  return (
    <>
      <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/* Logo */}
        <Link to='/' className='text-2xl font-bold tracking-tight text-slate-900'>
          Karigari
        </Link>

        {/* Desktop nav links */}
        <div className='hidden lg:flex items-center gap-7'>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={navLinkClass(to)}>
              {label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link to='/admin' className={navLinkClass('/admin')}>
              Admin
            </Link>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link to='/wishlist' className='relative group' aria-label="Wishlist">
            <Heart className={`h-5 w-5 transition-colors ${wishlistCount > 0 ? 'text-primary fill-primary/20' : 'text-slate-600 group-hover:text-slate-900'}`} />
            {wishlistCount > 0 && (
              <span className='absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none'>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User */}
          <Link to={user ? '/profile' : '/login'} className='group' aria-label="Account">
            <User className='h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors' />
          </Link>

          {/* Cart */}
          <button onClick={() => setDrawerOpen(!drawerOpen)} className='relative group' aria-label="Cart">
            <ShoppingBag className='h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors' />
            {cartCount > 0 && (
              <span className='absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none'>
                {cartCount}
              </span>
            )}
          </button>

          <SearchBar />

          {/* Mobile menu toggle */}
          <button onClick={() => setNavDrawerOpen(!navDrawerOpen)} className='lg:hidden' aria-label="Menu">
            <Menu className='h-5 w-5 text-slate-600' />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={() => setDrawerOpen(!drawerOpen)} />

      {/* Mobile drawer overlay */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setNavDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 left-0 w-72 h-full bg-white shadow-xl transform transition-transform duration-300 z-50 lg:hidden ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-lg font-bold text-slate-900">Karigari</span>
          <button onClick={() => setNavDrawerOpen(false)} aria-label="Close menu">
            <X className='h-5 w-5 text-slate-600' />
          </button>
        </div>
        <nav className='p-5 space-y-1'>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setNavDrawerOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link
              to='/admin'
              onClick={() => setNavDrawerOpen(false)}
              className='block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </>
  )
}

export default Navbar