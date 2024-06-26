import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { FaBagShopping, FaHeart, FaUser } from 'react-icons/fa6'
import { RxHamburgerMenu } from 'react-icons/rx'
import { APP_NAME } from './../../utils/constant'
import useStore from './../../store/store'
import Logo from './Logo'
import { MdLogout } from 'react-icons/md'
import { RiDashboard3Fill } from 'react-icons/ri'
import Search from '../modal/Navbar/Search'

const Navbar = () => {
  const [onScroll, setOnScroll] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false)
  const [openSearchModal, setOpenSearchModal] = useState(false)

  const sidebarRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const profileDropdownRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const searchModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  
  const { userState, logout } = useStore()

  const handleLogout = async() => {
    await logout()
    setOpenProfileDropdown(false)
  }

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

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setOpenProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openProfileDropdown])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openSearchModal && searchModalRef.current && !searchModalRef.current.contains(e.target as Node)) {
        setOpenSearchModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openSearchModal])

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
          <div className='flex md:flex-row flex-col md:items-center md:gap-7 gap-4 text-sm' />
          <div className='text-sm flex items-center justify-center md:gap-14 gap-4 md:mt-0 mt-8'>
            <div onClick={() => setOpenSearchModal(true)} className='flex items-center gap-3 cursor-pointer'>
              <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                <AiOutlineSearch />
              </div>
              <p className='md:block hidden'>Search</p>
            </div>
            <Link to='/' className='flex items-center gap-3'>
              <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                <FaHeart className='text-xs' />
              </div>
              <p className='md:block hidden'>Wishlist (0)</p>
            </Link>
            <Link to='/' className='flex items-center gap-3'>
              <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                <FaBagShopping className='text-xs' />
              </div>
              <p className='md:block hidden'>Cart (0)</p>
            </Link>
            {
              !userState.data.accessToken
              ? (
                <Link to='/login' className='flex items-center gap-3'>
                  <div className='rounded-full p-2 bg-gray-800 text-white flex items-center justify-center'>
                    <FaUser className='text-xs' />
                  </div>
                  <p className='md:block hidden'>Sign In</p>
                </Link>
              )
              : (
                <div ref={profileDropdownRef} className='relative'>
                  <div onClick={() => setOpenProfileDropdown(!openProfileDropdown)} className='flex items-center gap-3 cursor-pointer'>
                    {
                      !userState.data.user?.avatar
                      ? (
                        <div className='w-8 h-8 rounded-full bg-black text-sm flex items-center justify-center'>
                          <p className='text-white font-bold'>{`${userState.data.user?.name.split(' ')[0][0]} ${userState.data.user?.name.split(' ')[userState.data.user?.name.split(' ').length - 1][0]}`}</p>
                        </div>
                      )
                      : (
                        <div className='w-8 h-8 rounded-full bg-black'></div>
                      )
                    }
                    <p>{userState.data.user?.name}</p>
                  </div>
                  <div className={`absolute top-full mt-3 border border-gray-300 rounded-md w-[180px] right-0 bg-white ${openProfileDropdown ? 'scale-y-100' : 'scale-y-0'} transition origin-top`}>
                    {
                      userState.data.user?.role === 'admin' &&
                      <Link to='/admin' className='flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition cursor-pointer rounded-t-md border-b bordeer-gray-300'>
                        <RiDashboard3Fill />
                        <p>Dashboard</p>
                      </Link>
                    }
                    <div onClick={handleLogout} className='flex items-center gap-3 py-3 px-4 hover:bg-gray-100 transition cursor-pointer rounded-b-md'>
                      <MdLogout />
                      <p>Logout</p>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
      
      <Search
        openSearchModal={openSearchModal}
        setOpenSearchModal={setOpenProfileDropdown}
        searchModalRef={searchModalRef}
      />
    </>
  )
}

export default Navbar