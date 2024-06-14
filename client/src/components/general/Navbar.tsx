import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { FaBagShopping, FaUser } from 'react-icons/fa6'
import { RxHamburgerMenu } from 'react-icons/rx'
import { APP_NAME } from './../../utils/constant'
import Logo from './Logo'

const Navbar = () => {
  const [onScroll, setOnScroll] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)

  const sidebarRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0)
        setOnScroll(true)
      else
        setOnScroll(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenSidebar(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openSidebar])

  return (
    <>
      <div className={`flex md:px-12 px-6 py-4 gap-20 items-center justify-between sticky top-0 z-10 bg-white ${onScroll ? 'shadow-lg' : 'shadow-none'}`}>
        <div className={`md:hidden ${openSidebar ? 'block' : 'hidden'} fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)]`} />
        <div>
          <Link to='/' className='flex items-center gap-5 outline-none'>
            <Logo size='sm' />
            <p className='text-sm'>{APP_NAME}</p>
          </Link>
        </div>
        <RxHamburgerMenu onClick={() => setOpenSidebar(true)} className='cursor-pointer md:hidden block' />
        <div ref={sidebarRef} className={`flex-1 flex md:flex-row flex-col md:items-center md:justify-between md:static fixed top-0 transition-all duration-300 ${openSidebar ? 'right-0' : '-right-[500px]'} w-[200px] bg-white md:h-auto h-screen md:p-0 p-5 md:shadow-none shadow-xl`}>
          <div className='md:hidden block'>
            <AiOutlineClose onClick={() => setOpenSidebar(false)} className='cursor-pointer float-right mb-6' />
          </div>
          <div className='clear-both md:hidden' />
          <div className='flex md:flex-row flex-col md:items-center md:gap-7 gap-4 text-sm'>
            <div>
              <p className='cursor-pointer'>Categories</p>
            </div>
            <div>
              <p className='cursor-pointer'>Collections</p>
            </div>
            <Link to='/'>New Arrival</Link>
            <Link to='/'>Exchange Reward</Link>
          </div>
          <div className='text-sm flex items-center justify-center md:gap-14 gap-4 md:mt-0 mt-8'>
            <div className='flex items-center gap-3 cursor-pointer'>
              <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                <AiOutlineSearch />
              </div>
              <p className='md:block hidden'>Search</p>
            </div>
            <Link to='/' className='flex items-center gap-3'>
              <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                <FaBagShopping className='text-xs' />
              </div>
              <p className='md:block hidden'>Cart (0)</p>
            </Link>
            <Link to='/login' className='flex items-center gap-3'>
              <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                <FaUser className='text-xs' />
              </div>
              <p className='md:block hidden'>Sign In</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar