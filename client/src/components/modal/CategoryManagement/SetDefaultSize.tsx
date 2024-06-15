import { AiOutlineClose } from 'react-icons/ai'

interface IProps {
  openSetDefaultSizeModal: boolean
  setOpenSetDefaultSizeModal: React.Dispatch<React.SetStateAction<boolean>>
  setDefaultSizeModalRef: React.MutableRefObject<HTMLDivElement>
}

const SetDefaultSize: React.FC<IProps> = ({ openSetDefaultSizeModal, setOpenSetDefaultSizeModal, setDefaultSizeModalRef }) => {
  return (
    <div className={`${openSetDefaultSizeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={setDefaultSizeModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openSetDefaultSizeModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Set Shirt Default Size</p>
          <AiOutlineClose onClick={() => setOpenSetDefaultSizeModal(false)} className='cursor-pointer' />
        </div>
        <form className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='border border-gray-300 rounded-md'>
            <div className='px-5 py-2 border-b border-gray-300'>
              <p>Size: S</p>
            </div>
            <div className='px-5 py-3'>
              <div>
                <p className='text-sm'>Lingkar Pinggang</p>
                <input type='text' defaultValue='' className='w-full outline-none border border-gray-300 px-2 py-3 text-sm rounded-md mt-4' />
              </div>
            </div>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='bg-black text-white text-sm px-5 py-3 rounded-md transition hover:bg-gray-800'>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SetDefaultSize