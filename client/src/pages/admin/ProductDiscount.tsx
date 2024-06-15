import { useState, useEffect, useRef } from 'react'
import { LuPlus } from "react-icons/lu"
import AdminLayout from "../../components/template/AdminLayout"
import { AiOutlineSearch } from "react-icons/ai"
import { FaTrashAlt } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import Pagination from '../../components/general/Pagination'
import UpsertProductDiscount from '../../components/modal/ProductDiscountManagement/UpsertProductDiscount'

const ProductDiscount = () => {
  const [keyword, setKeyword] = useState('')
  const [activeDiscount, setActiveDiscount] = useState(true)
  const [openUpsertProductDiscountModal, setOpenUpsertProductDiscountModal] = useState(false)

  const upsertProductDiscountModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertProductDiscountModal && upsertProductDiscountModalRef.current && !upsertProductDiscountModalRef.current.contains(e.target as Node)) {
        setOpenUpsertProductDiscountModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openUpsertProductDiscountModal])

  return (
    <>
      <AdminLayout title='Product Discount Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Product Discount</h1>
            <div className='flex items-center gap-5'>
              <div className='relative bg-white py-3 rounded-md shadow-xl px-3 w-[300px]'>
                <input type='text' name='keyword' id='keyword' value={keyword} onChange={e => setKeyword(e.target.value)} className='outline-none bg-white' />
                <div className={`${keyword ? 'hidden' : 'flex'} items-center gap-3 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 text-sm pointer-events-none`}>
                  <AiOutlineSearch />
                  <p>Search</p>
                </div>
              </div>
              <button onClick={() => setOpenUpsertProductDiscountModal(true)} className='flex items-center gap-3 bg-black text-white rounded-md py-3 px-5 text-sm transition hover:bg-gray-800'>
                <LuPlus />
                <p>Add Product Discount</p>
              </button>
            </div>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold'>List Product Discount</p>
              <div className='flex items-center gap-3'>
                <div onClick={() => setActiveDiscount(!activeDiscount)} className='w-12 h-6 rounded-full bg-white border border-gray-500 relative cursor-pointer'>
                  <div className={`w-4 h-4 rounded-full ${activeDiscount ? 'bg-black right-1' : 'bg-gray-200 right-7'} absolute top-1/2 -translate-y-1/2 transition-all duration-300`} />
                </div>
                <p className='text-sm'>Active</p>
              </div>
            </div>
            <div className='overflow-x-auto mt-8'>
              <table className='w-full text-left'>
                <thead className='text-sm text-gray-500 font-normal'>
                  <tr>
                    <th className='pb-5'>Product Name</th>
                    <th className='pb-5'>Percentage</th>
                    <th className='pb-5'>Start Date</th>
                    <th className='pb-5'>End Date</th>
                    <th className='pb-5'>Action</th>
                  </tr>
                </thead>
                <tbody className='text-sm'>
                  <tr className='border-b border-gray-200'>
                    <td className='py-4'>Blazer Long Sleeve</td>
                    <td>30%</td>
                    <td>12 January 2024</td>
                    <td>15 January 2024</td>
                    <td className='flex items-center gap-4 py-4'>
                      <MdEdit className='text-blue-500 text-xl cursor-pointer' />
                      <FaTrashAlt className='text-red-500 text-lg cursor-pointer' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='mt-12 flex justify-center'>
              <Pagination />
            </div>
          </div>
        </div>
      </AdminLayout>

      <UpsertProductDiscount
        openUpsertProductDiscountModal={openUpsertProductDiscountModal}
        setOpenUpsertProductDiscountModal={setOpenUpsertProductDiscountModal}
        upsertProductDiscountModalRef={upsertProductDiscountModalRef}
      />
    </>
  )
}

export default ProductDiscount