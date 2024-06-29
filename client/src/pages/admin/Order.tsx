import { useState, useEffect, useRef } from 'react'
import { AiFillEye } from 'react-icons/ai'
import { useNavigate, useLocation } from 'react-router-dom'
import AdminLayout from './../../components/template/AdminLayout'
import Pagination from '../../components/general/Pagination'
import { MdLocalShipping } from 'react-icons/md'
import Waybill from '../../components/modal/CustomerOrder/Waybill'
import Detail from '../../components/modal/CustomerOrder/Detail'
import useStore from './../../store/store'
import Loader from '../../components/general/Loader'
import { currencyFormatter } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { ICheckout } from '../../utils/interface'

const Order = () => {
  const [openWaybillModal, setOpenWaybillModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedCustomerOrder, setSelectedCustomerOrder] = useState<Partial<ICheckout>>({})
  const [selectedStatus, setSelectedStatus] = useState('onProcess')

  const waybillModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const detailModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const page = Number(searchParams.get('page')) || 1
  const limit = 9

  const { userState, customerOrderState, readCustomerOrder } = useStore()

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        navigate(`/admin/order?page=${page - 1}`)
      } else {
        navigate('/admin/order')
      }
    } else if (type === 'next') {
      if (page === customerOrderState.totalPage) {
        navigate(`/admin/order?page=${customerOrderState.totalPage}`)
      } else {
        navigate(`/admin/order?page=${page + 1}`)
      }
    }
  }

  const handleClickDetail = (item: ICheckout) => {
    setSelectedCustomerOrder(item)
    setOpenDetailModal(true)
  }

  const handleClickWaybill = (item: ICheckout) => {
    setSelectedCustomerOrder(item)
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

  useEffect(() => {
    if (userState.data.accessToken)
      readCustomerOrder(userState.data.accessToken, page, limit, selectedStatus)
  }, [readCustomerOrder, userState.data.accessToken, page, limit, selectedStatus])

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
      <AdminLayout title='Order Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Customer Order</h1>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold'>List Customer Order</p>
              <div className='flex items-center gap-12'>
                <div className='text-sm flex items-center gap-3'>
                  <input type='radio' id='onProcess' value='onProcess' name='status' checked={selectedStatus === 'onProcess'} onChange={e => setSelectedStatus(e.target.value)} />
                  <label htmlFor='onProcess'>On Process</label>
                </div>
                <div className='text-sm flex items-center gap-3'>
                  <input type='radio' id='onDelivery' value='onDelivery' name='status' checked={selectedStatus === 'onDelivery'} onChange={e => setSelectedStatus(e.target.value)} />
                  <label htmlFor='onDelivery'>On Delivery</label>
                </div>
                <div className='text-sm flex items-center gap-3'>
                  <input type='radio' id='complete' value='complete' name='status' checked={selectedStatus === 'complete'} onChange={e => setSelectedStatus(e.target.value)} />
                  <label htmlFor='complete'>Complete</label>
                </div>
              </div>
            </div>
            {
              customerOrderState.loading
              ? (
                <div className='mt-8 flex justify-center'>
                  <Loader size='xl' />
                </div>
              )
              : (
                <>
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
                      {
                        customerOrderState.data.length === 0
                        ? (
                          <tbody>
                            <tr className='bg-red-500'>
                              <td colSpan={7} className='rounded-md text-center text-white font-bold py-3 text-sm'>
                                No records found
                              </td>
                            </tr>
                          </tbody>
                        )
                        : (
                          <tbody className='text-sm'>
                            {
                              customerOrderState.data.map(item => (
                                <tr key={item._id} className='border-b border-gray-200'>
                                  <td className='py-4'>{item.user.name}</td>
                                  <td>{item.email}</td>
                                  <td>{item.phone}</td>
                                  <td>{currencyFormatter(item.total)},00</td>
                                  <td>{item.paymentStatus}</td>
                                  <td>{formatDate(item.createdAt)}</td>
                                  <td className='flex items-center gap-5 py-4'>
                                    <AiFillEye onClick={() => handleClickDetail(item)} className='text-blue-500 text-xl cursor-pointer' />
                                    {
                                      selectedStatus !== 'complete' &&
                                      <MdLocalShipping onClick={() => handleClickWaybill(item)} className='text-orange-500 text-xl cursor-pointer' />
                                    }
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        )
                      }
                    </table>
                  </div>

                  {
                    customerOrderState.totalPage > 1 &&
                    <div className='mt-12 flex justify-center'>
                      <Pagination
                        currentPage={page}
                        totalPage={customerOrderState.totalPage}
                        handleChangePage={handleChangePage}
                      />
                    </div>
                  }
                </>
              )
            }
          </div>
        </div>
      </AdminLayout>

      <Waybill
        openWaybillModal={openWaybillModal}
        setOpenWaybillModal={setOpenWaybillModal}
        waybillModalRef={waybillModalRef}
        selectedCustomerOrder={selectedCustomerOrder as ICheckout}
      />

      <Detail
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        detailModalRef={detailModalRef}
        selectedCustomerOrder={selectedCustomerOrder as ICheckout}
      />
    </>
  )
}

export default Order