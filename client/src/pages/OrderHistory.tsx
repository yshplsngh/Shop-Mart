import { useState, useEffect, useRef } from 'react'
import { AiFillEye } from 'react-icons/ai'
import { currencyFormatter } from '../utils/currency'
import { useNavigate, useLocation } from 'react-router-dom'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'
import useStore from './../store/store'
import { formatDate } from '../utils/date'
import Loader from '../components/general/Loader'
import { ICheckout } from '../utils/interface'
import Detail from '../components/modal/CustomerOrder/Detail'
import Complete from '../components/modal/CustomerOrder/Complete'
import Pagination from '../components/general/Pagination'

const OrderHistory = () => {
  const [selectedStatus, setSelectedStatus] = useState('onProcess')
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [openCompleteModal, setOpenCompleteModal] = useState(false)
  const [selectedCustomerOrder, setSelectedCustomerOrder] = useState<Partial<ICheckout>>({})

  const detailModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const completeModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  
  const navigate = useNavigate()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const page = Number(searchParams.get('page')) || 1
  const limit = 9

  const { userState, orderHistoryState, readOrderHistory } = useStore()

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        navigate(`/order-history?page=${page - 1}`)
      } else {
        navigate('/order-history')
      }
    } else if (type === 'next') {
      if (page === orderHistoryState.totalPage) {
        navigate(`/order-history?page=${orderHistoryState.totalPage}`)
      } else {
        navigate(`/order-history?page=${page + 1}`)
      }
    }
  }

  const handleClickDetail = (item: ICheckout) => {
    setSelectedCustomerOrder(item)
    setOpenDetailModal(true)
  }

  const handleClickComplete = (item: ICheckout) => {
    setSelectedCustomerOrder(item)
    setOpenCompleteModal(true)
  }

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
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openCompleteModal && completeModalRef.current && !completeModalRef.current.contains(e.target as Node)) {
        setOpenCompleteModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openCompleteModal])

  useEffect(() => {
    if (userState.data.accessToken)
      readOrderHistory(userState.data.accessToken, page, limit, selectedStatus)
  }, [readOrderHistory, userState.data.accessToken, page, limit, selectedStatus])
  
  useEffect(() => {
    if (!userState.loading) {
      if (!userState.data.accessToken) {
        navigate('/login')
      } else {
        if (userState.data.user?.role === 'admin') {
          navigate('/admin')
        }
      }
    }
  }, [userState.data.user, userState.data.accessToken, userState.loading, navigate])

  return (
    <>
      <HeadInfo title='Order History' />
      <Navbar />
      <div className='py-10 md:px-12 px-6'>
        <div>
          <h1 className='text-center text-3xl font-medium'>Order History</h1>
        </div>
        <div className='flex items-center gap-12 mt-10 justify-end'>
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
        {
          orderHistoryState.loading
          ? (
            <div className='mt-8 flex justify-center'>
              <Loader size='xl' />
            </div>
          )
          : (
            <>
              {
                orderHistoryState.data.length === 0
                ? (
                  <div className='w-full bg-orange-500 rounded-md text-white font-semibold text-center p-3 mt-10 text-sm'>
                    <p>Your order history is currently empty</p>
                  </div>
                )
                : (
                  <>
                    <div className='overflow-x-auto w-full mt-16'>
                      <table className='w-full text-left'>
                        <thead className='text-sm text-gray-500 font-normal'>
                          <tr>
                            <th className='pb-5'>Order ID</th>
                            <th className='pb-5'>Items Count</th>
                            <th className='pb-5'>Shipping Cost</th>
                            <th className='pb-5'>Total</th>
                            <th className='pb-5'>Payment Status</th>
                            <th className='pb-5'>Order Date</th>
                            <th className='pb-5'>Action</th>
                          </tr>
                        </thead>
                        <tbody className='text-sm'>
                          {
                            orderHistoryState.data.map(item => (
                              <tr key={item._id} className='border-b border-gray-200'>
                                <td className='py-4'>{item._id}</td>
                                <td>{item.item.length}</td>
                                <td>{currencyFormatter(item.shippingCost)},00</td>
                                <td>{currencyFormatter(item.total)},00</td>
                                <td>{item.paymentStatus}</td>
                                <td>{formatDate(item.createdAt)}</td>
                                <td className='flex items-center gap-5 py-4'>
                                  <AiFillEye onClick={() => handleClickDetail(item)} className='text-blue-500 text-xl cursor-pointer' />
                                  {
                                    selectedStatus === 'onDelivery' &&
                                    <button onClick={() => handleClickComplete(item)} className='bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition'>Complete</button>
                                  }
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    {
                      orderHistoryState.totalPage > 1 &&
                      <div className='mt-12 flex justify-center'>
                        <Pagination
                          currentPage={page}
                          totalPage={orderHistoryState.totalPage}
                          handleChangePage={handleChangePage}
                        />
                      </div>
                    }
                  </>
                )
              }
            </>
          )
        }
      </div>
      <Footer />

      <Detail
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        detailModalRef={detailModalRef}
        selectedCustomerOrder={selectedCustomerOrder as ICheckout}
        adminView={false}
      />

      <Complete
        openCompleteModal={openCompleteModal}
        setOpenCompleteModal={setOpenCompleteModal}
        completeModalRef={completeModalRef}
        selectedCustomerOrder={selectedCustomerOrder as ICheckout}
      />
    </>
  )
}

export default OrderHistory