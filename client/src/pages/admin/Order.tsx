import { useState, useEffect, useRef } from 'react'
import { AiFillEye, AiOutlineSearch } from 'react-icons/ai'
import AdminLayout from './../../components/template/AdminLayout'
import Pagination from '../../components/general/Pagination'
import { MdLocalShipping } from 'react-icons/md'
import Waybill from '../../components/modal/CustomerOrder/Waybill'
import Detail from '../../components/modal/CustomerOrder/Detail'

const Order = () => {
  const [keyword, setKeyword] = useState('')
  const [openWaybillModal, setOpenWaybillModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)

  const waybillModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const detailModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleClickDetail = () => {
    setOpenDetailModal(true)
  }

  const handleClickWaybill = () => {
    setOpenWaybillModal(true)
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openWaybillModal && waybillModalRef.current && !waybillModalRef.current.contains(e.target as Node)) {
        setOpenWaybillModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openWaybillModal])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDetailModal && detailModalRef.current && !detailModalRef.current.contains(e.target as Node)) {
        setOpenDetailModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDetailModal])

  return (
    <>
      <AdminLayout title='Order Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Customer Order</h1>
            <div className='relative bg-white py-3 rounded-md shadow-xl px-3 w-[300px]'>
              <input type='text' name='keyword' id='keyword' value={keyword} onChange={e => setKeyword(e.target.value)} className='outline-none bg-white' />
              <div className={`${keyword ? 'hidden' : 'flex'} items-center gap-3 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 text-sm pointer-events-none`}>
                <AiOutlineSearch />
                <p>Search</p>
              </div>
            </div>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold'>List Customer Order</p>
              <div className='flex items-center gap-12'>
                <div className='text-sm flex items-center gap-3'>
                  <input type='radio' id='onProcess' value='onProcess' name='status' />
                  <label htmlFor='onProcess'>On Process</label>
                </div>
                <div className='text-sm flex items-center gap-3'>
                  <input type='radio' id='onDelivery' value='onDelivery' name='status' />
                  <label htmlFor='onDelivery'>On Delivery</label>
                </div>
                <div className='text-sm flex items-center gap-3'>
                  <input type='radio' id='complete' value='complete' name='status' />
                  <label htmlFor='complete'>Complete</label>
                </div>
              </div>
            </div>
            <div className='overflow-x-auto mt-12'>
              <table className='w-full text-left'>
                <thead className='text-sm text-gray-500 font-normal'>
                  <tr>
                    <th className='pb-5'>Name</th>
                    <th className='pb-5'>Email</th>
                    <th className='pb-5'>Phone</th>
                    <th className='pb-5'>Total</th>
                    <th className='pb-5'>Payment Status</th>
                    <th className='pb-5'>Order Date</th>
                    <th className='pb-5'>Action</th>
                  </tr>
                </thead>
                <tbody className='text-sm'>
                  <tr className='border-b border-gray-200'>
                    <td className='py-4'>Test</td>
                    <td>Test</td>
                    <td>Test</td>
                    <td>Test</td>
                    <td>Test</td>
                    <td>Test</td>
                    <td className='flex items-center gap-5 py-4'>
                      <AiFillEye onClick={handleClickDetail} className='text-blue-500 text-xl cursor-pointer' />
                      <MdLocalShipping onClick={handleClickWaybill} className='text-orange-500 text-xl cursor-pointer' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='mt-12 flex justify-center'>
              <Pagination
                currentPage={1}
                totalPage={1}
                handleChangePage={() => {}}
              />
            </div>
          </div>
        </div>
      </AdminLayout>

      <Waybill
        openWaybillModal={openWaybillModal}
        setOpenWaybillModal={setOpenWaybillModal}
        waybillModalRef={waybillModalRef}
      />

      <Detail
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        detailModalRef={detailModalRef}
      />
    </>
  )
}

export default Order