import { useState, useEffect } from 'react'
import { AiOutlineClose } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'
import { currencyFormatter } from "../../../utils/currency"
import { APP_NAME } from "../../../utils/constant"
import * as Buffer from 'buffer'
import axios from 'axios'
import { XENDIT_API_KEY } from '../../../config/key'
import useStore from './../../../store/store'
import { validPhoneNumber } from '../../../utils/validator'

interface IProps {
  openPaymentModal: boolean
  setOpenPaymentModal: React.Dispatch<React.SetStateAction<boolean>>
  paymentModalRef: React.MutableRefObject<HTMLDivElement>
  subtotal: number
  shipping: number
  total: number
  phone: string
  user: string
}

const Payment: React.FC<IProps> = ({ openPaymentModal, setOpenPaymentModal, paymentModalRef, subtotal, shipping, total, phone, user }) => {
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('')

  const [paymentLoading, setPaymentLoading] = useState(false)

  const navigate = useNavigate()

  const { initiate } = useStore()

  const handlePayment = async() => {
    setPaymentLoading(true)

    if (!validPhoneNumber(mobilePhoneNumber)) {
      initiate('Please provide valid phone number', 'error')
      setPaymentLoading(false)
      return
    }

    const res = await axios.post('https://api.xendit.co/ewallets/charges', {
      'reference_id': `${user}_order_${new Date()}`,
      'currency': 'IDR',
      'amount': total,
      'checkout_method': 'ONE_TIME_PAYMENT',
      'channel_code': 'ID_OVO',
      'channel_properties': {
        'mobile_number': `+62${mobilePhoneNumber}`
      }
    }, {
      headers: {
        Authorization: `Basic ${Buffer.Buffer.from(XENDIT_API_KEY).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    setPaymentLoading(false)
    setOpenPaymentModal(false)

    initiate('Thank you for your purchase. Please kindly check your payment status at your order page', 'success')
    navigate('/')
  }

  useEffect(() => {
    setMobilePhoneNumber(phone)
  }, [phone])

  return (
    <div className={`${openPaymentModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity z-10 p-5`}>
      <div ref={paymentModalRef} className={`md:w-1/2 w-full flex flex-col max-h-[90%] bg-white rounded-lg ${openPaymentModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Payment</p>
          <AiOutlineClose onClick={() => setOpenPaymentModal(false)} className='cursor-pointer' />
        </div>
        <div className='px-6 py-5'>
          <div className='mb-10'>
            <h1 className='text-xl font-semibold'>Amount to be Paid</h1>
            <div className='mt-5'>
              <div className='flex items-center justify-between mb-3'>
                <p>Subtotal</p>
                <p>{currencyFormatter(subtotal)},00</p>
              </div>
              <div className='flex items-center justify-between'>
                <p>Shipping Cost</p>
                <p>{currencyFormatter(shipping)},00</p>
              </div>
              <hr className='my-5' /> 
              <div className='flex items-center justify-between font-semibold'>
                <p>Total</p>
                <p>{currencyFormatter(total)},00</p>
              </div>
            </div>
          </div>
          <div className='mb-10'>
            <h1 className='text-xl font-semibold'>Payment Method</h1>
            <div className='mt-5'>
              <div className='w-36 h-16 border-2 border-black p-1 rounded-md cursor-pointer'>
                <img src={`${process.env.PUBLIC_URL}/images/payment_method/ovo.png`} alt={`${APP_NAME} - OVO`} className='w-full h-full' />
              </div>
            </div>
          </div>
          <div className='mb-8'>
            <h1 className='text-xl font-semibold'>Mobile Phone Confirmation</h1>
            <div className={`${paymentLoading ? 'bg-gray-200' : 'bg-white'} w-full border border-gray-300 rounded-md flex-1 mt-3 px-4 py-3 flex items-center gap-3`}>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-6 border border-gray-300'>
                  <div className='w-full h-3 bg-red-500' />
                  <div className='w-full h-2 bg-white' />
                </div>
                <p className='text-sm'>+62</p>
              </div>
              <input type='text' readOnly={paymentLoading} id='phone' name='phone' value={mobilePhoneNumber.replace(/[^0-9]/g, '')} onChange={e => setMobilePhoneNumber(e.target.value)} placeholder='Enter your phone number' autoComplete='off' className={`outline-none text-sm w-full ${paymentLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white cursor-text'}`} />
            </div>
          </div>
          <button onClick={handlePayment} disabled={!mobilePhoneNumber || paymentLoading} className={`${!mobilePhoneNumber || paymentLoading ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} transition text-white font-semibold rounded-md p-3 w-full`}>
            {
              paymentLoading
              ? 'Loading ...'
              : 'Pay Now'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payment