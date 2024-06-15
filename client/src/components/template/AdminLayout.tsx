import { FaTshirt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HeadInfo from './../../utils/HeadInfo'
import { ReactNode } from 'react'
import { MdCategory } from 'react-icons/md'

interface IProps {
    title: string
    children: ReactNode
}

const AdminLayout: React.FC<IProps> = ({ title, children }) => {
    return (
        <>
            <HeadInfo title={title} />
            <div className='flex h-screen max-h-screen'>
                <div className='flex flex-col flex-1 py-10'>
                    <div className='flex-1'>
                        <div className='flex flex-col items-center'>
                            <div className='w-20 h-20 rounded-full bg-gray-200'></div>
                            <p className='font-semibold mt-4'>Lorem Ipsum</p>
                            <p className='text-xs text-gray-400 mt-2'>Admin</p>
                        </div>
                        <div className='mt-8'>
                            <Link to='/admin/category' className='flex items-center gap-3 px-5 py-4 outline-none bg-gray-900 text-white before:content-[""] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gray-600 relative'>
                                <MdCategory />
                                <p>Category</p>
                            <Link to='/'
                                  className='flex items-center gap-3 px-5 py-4 outline-none hover:bg-gray-900 hover:text-white hover:before:content-[""] hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-1 hover:before:h-full hover:before:bg-gray-600 transition relative'>
                                <FaTshirt/>
                                <p>Products</p>
                            </Link>
                        </div>
                    </div>
                    <div className='px-7'>
                        <button
                            className='text-red-500 bg-red-100 font-semibold w-full rounded-md py-3 text-sm hover:bg-red-500 hover:text-white transition'>Logout
                        </button>
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