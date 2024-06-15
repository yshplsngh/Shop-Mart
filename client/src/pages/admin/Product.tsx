import { useState, useEffect, useRef } from 'react'
import { AiOutlineSearch } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'
import AdminLayout from "../../components/template/AdminLayout"
import { LuPlus } from "react-icons/lu"
import UpsertProduct from '../../components/modal/ProductManagement/UpsertProduct'
import { FaTrashAlt } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import Pagination from '../../components/general/Pagination'
import useStore from './../../store/store'

const Product = () => {
  const [openUpsertProductModal, setOpenUpsertProductModal] = useState(false)
  const [keyword, setKeyword] = useState('')

  const upsertProductModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()

  const { userState } = useStore()

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertProductModal && upsertProductModalRef.current && !upsertProductModalRef.current.contains(e.target as Node)) {
        setOpenUpsertProductModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openUpsertProductModal])

  useEffect(() => {
    if (!userState.loading) {
      if (userState.data.accessToken) {
        if (userState.data.user?.role !== 'admin') {
          navigate('/')
        }
      } else {
        navigate('/login')
      }
    }
  }, [userState.data, userState.loading, navigate])

  return (
    <>
      <AdminLayout title='Product Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Product</h1>
            <div className='flex items-center gap-5'>
              <div className='relative bg-white py-3 rounded-md shadow-xl px-3 w-[300px]'>
                <input type='text' name='keyword' id='keyword' value={keyword} onChange={e => setKeyword(e.target.value)} className='outline-none bg-white' />
                <div className={`${keyword ? 'hidden' : 'flex'} items-center gap-3 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 text-sm pointer-events-none`}>
                  <AiOutlineSearch />
                  <p>Search</p>
                </div>
              </div>
              <button onClick={() => setOpenUpsertProductModal(true)} className='flex items-center gap-3 bg-black text-white rounded-md py-3 px-5 text-sm transition hover:bg-gray-800'>
                <LuPlus />
                <p>Add Product</p>
              </button>
            </div>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <p className='font-semibold'>List Product</p>
            <div className='overflow-x-auto mt-8'>
              <table className='w-full text-left'>
                <thead className='text-sm text-gray-500 font-normal'>
                  <tr>
                    <th className='pb-5'>Product Name</th>
                    <th className='pb-5'>Price</th>
                    <th className='pb-5'>Category</th>
                    <th className='pb-5'>Created At</th>
                    <th className='pb-5'>Action</th>
                  </tr>
                </thead>
                <tbody className='text-sm'>
                  <tr className='border-b border-gray-200'>
                    <td className='py-4'>Blazer Long Sleeve</td>
                    <td>IDR 300.000,00</td>
                    <td>Sihrt</td>
                    <td>12 January 2024</td>
                    <td className='flex items-center gap-4 py-4'>
                      <MdEdit className='text-blue-500 text-xl cursor-pointer' />
                      <FaTrashAlt className='text-red-500 text-lg cursor-pointer' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='mt-12 flex justify-center'>
              <Pagination
                currentPage={0}
                totalPage={0}
                handleChangePage={(type: string) => {}}
              />
            </div>
          </div>
        </div>
      </AdminLayout>

      <UpsertProduct
        openUpsertProductModal={openUpsertProductModal}
        setOpenUpsertProductModal={setOpenUpsertProductModal}
        upsertProductModalRef={upsertProductModalRef}
      />
    </>
  )
}

export default Product