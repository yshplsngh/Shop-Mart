import { useLocation } from 'react-router-dom'
import { FaTshirt } from 'react-icons/fa'
import { MdCategory, MdDiscount } from 'react-icons/md'
import { Link } from 'react-router-dom'
import HeadInfo from './../../utils/HeadInfo'
import { ReactNode } from 'react'
import { RiDashboard3Fill } from 'react-icons/ri'
import useStore from './../../store/store'

interface IProps {
  title: string
  children: ReactNode
}

const AdminLayout: React.FC<IProps> = ({ title, children }) => {
  const { pathname } = useLocation()

  const { userState, logout } = useStore()

  return (
    <>
      <HeadInfo title={title} />
      <div className='flex h-screen max-h-screen'>
        <div className='flex flex-col flex-1 py-10'>
          <div className='flex-1'>
            <div className='flex flex-col items-center'>
              <div className='w-20 h-20 rounded-full bg-black text-3xl flex items-center justify-center'>
                <p className='text-white font-bold'>{`${userState.data.user?.name.split(' ')[0][0]} ${userState.data.user?.name.split(' ')[userState.data.user?.name.split(' ').length - 1][0]}`}</p>
              </div>
              <p className='font-semibold mt-4'>{userState.data.user?.name}</p>
              <p className='text-xs text-gray-400 mt-2'>Admin</p>
            </div>
            <div className='mt-8'>
              <Link to='/admin' className={`${pathname === '/admin' ? 'bg-gray-900 text-white before:content-[""] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gray-600' : 'hover:bg-gray-900 hover:text-white hover:before:content-[""] hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-1 hover:before:h-full hover:before:bg-gray-600 transition'} flex items-center gap-3 px-5 py-4 outline-none relative`}>
                <RiDashboard3Fill />
                <p>Dashboard</p>
              </Link>
              <Link to='/admin/category' className={`${pathname === '/admin/category' ? 'bg-gray-900 text-white before:content-[""] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gray-600' : 'hover:bg-gray-900 hover:text-white hover:before:content-[""] hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-1 hover:before:h-full hover:before:bg-gray-600 transition'} flex items-center gap-3 px-5 py-4 outline-none relative`}>
                <MdCategory />
                <p>Category</p>
              </Link>
              <Link to='/admin/product' className={`${pathname === '/admin/product' ? 'bg-gray-900 text-white before:content-[""] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gray-600' : 'hover:bg-gray-900 hover:text-white hover:before:content-[""] hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-1 hover:before:h-full hover:before:bg-gray-600 transition'} flex items-center gap-3 px-5 py-4 outline-none relative`}>
                <FaTshirt />
                <p>Products</p>
              </Link>
              <Link to='/admin/product-discount' className={`${pathname === '/admin/product-discount' ? 'bg-gray-900 text-white before:content-[""] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gray-600' : 'hover:bg-gray-900 hover:text-white hover:before:content-[""] hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-1 hover:before:h-full hover:before:bg-gray-600 transition'} flex items-center gap-3 px-5 py-4 outline-none relative`}>
                <MdDiscount />
                <p>Product Discount</p>
              </Link>
            </div>
          </div>
          <div className='px-7'>
            <button onClick={() => logout()} className='text-red-500 bg-red-100 font-semibold w-full rounded-md py-3 text-sm hover:bg-red-500 hover:text-white transition'>Logout</button>
          </div>
        </div>
        <div className='flex-[4] bg-gray-100 px-8 py-10'>
          {children}
        </div>
      </div>
    </>
  )
}

export default AdminLayout