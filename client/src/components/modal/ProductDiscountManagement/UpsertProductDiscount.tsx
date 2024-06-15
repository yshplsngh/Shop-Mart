import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai"
import { FormSubmitted } from "../../../utils/interface"

interface IProps {
  openUpsertProductDiscountModal: boolean
  setOpenUpsertProductDiscountModal: React.Dispatch<React.SetStateAction<boolean>>
  upsertProductDiscountModalRef: React.MutableRefObject<HTMLDivElement>
}

const UpsertProductDiscount: React.FC<IProps> = ({ openUpsertProductDiscountModal, setOpenUpsertProductDiscountModal, upsertProductDiscountModalRef }) => {
  const handleSubmit = (e: FormSubmitted) => {
    e.preventDefault()
  }
  
  return (
    <div className={`${openUpsertProductDiscountModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={upsertProductDiscountModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openUpsertProductDiscountModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Create Product Discount</p>
          <AiOutlineClose onClick={() => setOpenUpsertProductDiscountModal(false)} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='mb-6'>
            <p className='text-sm'>Product</p>
            <div className='mt-4 relative'>
              <div className='rounded-md p-3 border border-gray-300 flex items-center gap-3'>
                <input type='text' className='flex-1 outline-none text-sm' />
                <AiOutlineSearch />
              </div>
              {/* <div className='absolute top-full mt-2 border border-gray-300 rounded-md w-full left-0 bg-white'>
                <div className='p-3 cursor-pointer border-b border-gray-300 rounded-t-md hover:bg-gray-100 transition'>
                  <p className='text-sm'>Blazer Long Sleeve</p>
                </div>
                <div className='p-3 cursor-pointer rounded-b-md hover:bg-gray-100 transition'>
                  <p className='text-sm'>Blazer Short Sleeve</p>
                </div>
              </div> */}
            </div>
          </div>
          <div className='mb-6'>
            <label htmlFor='percentage' className='text-sm'>Percentage</label>
            <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
          </div>
          <div className='flex items-center gap-4 mb-6'>
            <div className='flex-1'>
              <label htmlFor='startDate' className='text-sm'>Start Date</label>
              <input type='date' className='w-full outline-none border border-gray-300 p-3 text-sm rounded-md mt-4' />
            </div>
            <div className='flex-1'>
              <label htmlFor='endDate' className='text-sm'>End Date</label>
              <input type='date' className='w-full outline-none border border-gray-300 p-3 text-sm rounded-md mt-4' />
            </div>
          </div>
          <div className='flex justify-end'>
            <button className='bg-black text-white rounded-md text-sm px-6 py-2 transition hover:bg-gray-800'>Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpsertProductDiscount