import { AiOutlineClose } from "react-icons/ai"
import { currencyFormatter } from "../../../utils/currency"
import { APP_NAME } from "../../../utils/constant"

interface IProps {
  openDetailModal: boolean
  setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>
  detailModalRef: React.MutableRefObject<HTMLDivElement>
}

const Detail: React.FC<IProps> = ({ openDetailModal, setOpenDetailModal, detailModalRef }) => {
  const handleClickClose = () => {
    setOpenDetailModal(false)
  }

  return (
    <div className={`${openDetailModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={detailModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openDetailModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Order Detail</p>
          <AiOutlineClose onClick={handleClickClose} className='cursor-pointer' />
        </div>
        <div className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='mb-10'>
            <h1 className='font-semibold mb-6'>General Information</h1>
            <div className='mb-6'>
              <label className='text-sm'>Order ID</label>
              <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
            </div>
            <div className='flex items-center gap-6 mb-6'>
              <div className='flex-1'>
                <label className='text-sm'>Xendit ID</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
              <div className='flex-1'>
                <label className='text-sm'>User ID</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
            </div>
            <div className='flex items-center gap-6 mb-6'>
              <div className='flex-1'>
                <label className='text-sm'>First Name</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
              <div className='flex-1'>
                <label className='text-sm'>Last Name</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
            </div>
            <div className='flex items-center gap-6'>
              <div className='flex-1'>
                <label className='text-sm'>Email</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
              <div className='flex-1'>
                <label className='text-sm'>Phone</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
            </div>
          </div>
          <div className='mb-10'>
            <h1 className='font-semibold mb-6'>Item Detail</h1>
            <div className='flex flex-col gap-8'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                  <div className='w-28 h-28 rounded-md bg-gray-100 border border-gray-300'>
                    <img src='' alt={`${APP_NAME}`} className='w-full h-full rounded-md object-cover' />
                  </div>
                  <div>
                    <div className='flex items-center gap-4'>
                      <h1 className='font-semibold text-lg'>Product Name</h1>
                      <div className='text-xs text-white rounded-md p-2 font-semibold bg-red-500'>
                        <p>30% Off</p>
                      </div>
                    </div>
                    <p className='mt-3 text-gray-500 text-sm'>Size: Small</p>
                    <p className='mt-1 text-gray-500 text-sm'>Color: Gray</p>
                    <p className='mt-1 text-gray-500 text-sm'>Qty: 1</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm line-through text-gray-400'>{currencyFormatter(30000)},00</p>
                  <p className='font-semibold mt-2'>{currencyFormatter(20000)},00</p>
                </div>
              </div>
            </div>
          </div>
          <div className='mb-10'>
            <h1 className='font-semibold mb-6'>Shipping Information</h1>
            <div className='flex items-center gap-6 mb-6'>
              <div className='flex-1'>
                <label className='text-sm'>Province</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
              <div className='flex-1'>
                <label className='text-sm'>City</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
            </div>
            <div className='flex items-center gap-6 mb-6'>
              <div className='flex-1'>
                <label className='text-sm'>District</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
              <div className='flex-1'>
                <label className='text-sm'>Postal Code</label>
                <input type='text' readOnly className='text-sm outline-none p-3 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md w-full mt-4' />
              </div>
            </div>
            <div>
              <label className='text-sm'>Address</label>
              <textarea readOnly className='text-sm p-3 rounded-md border border-gray-300 outline-none w-full mt-4 h-28 resize-none cursor-not-allowed bg-gray-100' />
            </div>
          </div>
          <div className='mb-10'>
            <h1 className='font-semibold mb-8'>Expedition Information</h1>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className={`w-28 h-14 flex items-center justify-center px-3 py-2 transition`}>
                  <img src={`${process.env.PUBLIC_URL}/images/couriers/jne.png`} alt={`${APP_NAME} - JNE Expedition`} className='w-full h-full' />
                </div>
                <div>
                  <h1 className='font-semibold text-lg'>Yakin Esok Sampai (YES)</h1>
                  <p className='text-sm mt-2 text-gray-500'>Waybill ID: ddd</p>
                </div>
              </div>
              <p className='font-semibold'>{currencyFormatter(20000)},00</p>
            </div>
          </div>
          <div className='mb-10'>
            <div className='flex items-center justify-between mb-6 font-semibold'>
              <h1>Payment Information</h1>
              <div className='text-white text-xs rounded-md px-4 py-2 bg-green-600'>
                <p>SUCCEEDED</p>
              </div>
            </div>
            <div>
              <div className='flex items-center justify-between mb-4'>
                <p>Payment Method</p>
                <p>OVO</p>
              </div>
              <div className='flex items-center justify-between mb-4'>
                <p>Subtotal</p>
                <p>{currencyFormatter(20000)},00</p>
              </div>
              <div className='flex items-center justify-between'>
                <p>Shipping Cost</p>
                <p>{currencyFormatter(20000)},00</p>
              </div>
              <hr className='my-4' />
              <div className='flex items-center justify-between font-semibold'>
                <p>Total</p>
                <p>{currencyFormatter(20000)},00</p>
              </div>
            </div>
          </div>
          <div>
            <div className='flex items-center justify-between font-semibold'>
              <h1>Order Complete</h1>
              <div className='bg-red-500 text-white text-xs rounded-md px-4 py-2'>
                <p>FALSE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail