import { BsQuestionCircleFill } from 'react-icons/bs'
import { ICheckout } from '../../../utils/interface'
import useStore from './../../../store/store'

interface IProps {
  openCompleteModal: boolean
  setOpenCompleteModal: React.Dispatch<React.SetStateAction<boolean>>
  completeModalRef: React.MutableRefObject<HTMLDivElement>
  selectedCustomerOrder: ICheckout
}

const Complete: React.FC<IProps> = ({ openCompleteModal, setOpenCompleteModal, completeModalRef, selectedCustomerOrder }) => {
  const { userState, completeOrder } = useStore()

  const handleCompleteOrder = () => {
    completeOrder(selectedCustomerOrder._id!, userState.data.accessToken!)
    setOpenCompleteModal(false)
  }

  return (
    <div className={`${openCompleteModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity z-10 p-5`}>
      <div ref={completeModalRef} className={`md:w-1/3 w-full flex flex-col max-h-[90%] bg-white rounded-lg ${openCompleteModal ? 'translate-y-0' : '-translate-y-10'} transition-transform p-8 flex items-center justify-center`}>
        <BsQuestionCircleFill className='text-9xl text-orange-500' />
        <p className='font-semibold text-center text-lg mt-6'>Are you sure to change order status to complete?</p>
        <div className='mt-6 flex items-center gap-5 justify-center'>
          <button onClick={() => setOpenCompleteModal(false)} className='bg-gray-200 rounded-md px-6 py-3 text-sm hover:bg-gray-300 transition'>No, I'm not sure</button>
          <button onClick={handleCompleteOrder} className='font-bold bg-green-500 text-white px-6 py-3 rounded-md text-sm hover:bg-green-600 transition'>Yes, I'm sure</button>
        </div>
      </div>
    </div>
  )
}

export default Complete