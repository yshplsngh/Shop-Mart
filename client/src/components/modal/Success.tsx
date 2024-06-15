import { IoIosCheckmarkCircle } from 'react-icons/io'

interface IProps {
  openSuccessModal: boolean
  // setOpenSuccessModal: React.Dispatch<React.SetStateAction<boolean>>
  // successModalRef: React.MutableRefObject<HTMLDivElement>
}

const Success: React.FC<IProps> = ({ openSuccessModal }) => {
  return (
    <div className={`${openSuccessModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div className={`w-1/3 flex flex-col max-h-[90%] bg-white rounded-lg ${openSuccessModal ? 'translate-y-0' : '-translate-y-10'} transition-transform p-8 flex items-center justify-center`}>
        <IoIosCheckmarkCircle className='text-9xl text-green-600' />
        <p className='mt-1'>Operation Success</p>
        <div className='mt-6'>
          <button className='font-bold bg-green-500 text-white px-6 py-3 rounded-md text-sm hover:bg-green-600 transition'>OK, I got it</button>
        </div>
      </div>
    </div>
  )
}

export default Success