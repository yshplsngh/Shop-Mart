import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormSubmitted, ICheckout } from './../../../utils/interface'
import useStore from './../../../store/store'

interface IProps {
  openWaybillModal: boolean
  setOpenWaybillModal: React.Dispatch<React.SetStateAction<boolean>>
  waybillModalRef: React.MutableRefObject<HTMLDivElement>
  selectedCustomerOrder: ICheckout
}

const Waybill: React.FC<IProps> = ({ openWaybillModal, setOpenWaybillModal, waybillModalRef, selectedCustomerOrder }) => {
  const [loading, setLoading] = useState(false)
  const [waybill, setWaybill] = useState('')

  const { userState, updateWaybill, readCustomerOrder } = useStore()

  const handleClickClose = () => {
    setOpenWaybillModal(false)
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)
    await updateWaybill(selectedCustomerOrder._id, waybill, userState.data.accessToken!)
    setOpenWaybillModal(false)
    readCustomerOrder(userState.data.accessToken!, 1, 9, 'onProcess')
    setLoading(false)
  }

  useEffect(() => {
    if (Object.keys(selectedCustomerOrder).length > 0) {
      setWaybill(selectedCustomerOrder.waybill)
    } else {
      setWaybill('')
    }
  }, [selectedCustomerOrder])

  return (
    <div className={`${openWaybillModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={waybillModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openWaybillModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Update Order Waybill</p>
          <AiOutlineClose onClick={handleClickClose} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='mb-6'>
            <label htmlFor='waybill' className='text-sm'>Waybill ID</label>
            <input type='text' id='waybill' name='waybill' value={waybill} onChange={e => setWaybill(e.target.value)} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
          </div>
          <div className='flex justify-end'>
            <button disabled={loading || !waybill} className={`${loading || !waybill ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} transition px-6 py-2 text-white rounded-md text-sm`}>
              {
                loading
                ? 'Loading ...'
                : 'Save Changes'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Waybill