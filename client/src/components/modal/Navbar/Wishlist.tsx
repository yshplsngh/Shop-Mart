import { AiOutlineClose } from "react-icons/ai"
import { FaTrash } from "react-icons/fa6"

interface IProps {
  openWishlist: boolean
  setOpenWishlist: React.Dispatch<React.SetStateAction<boolean>>
  wishlistRef: React.MutableRefObject<HTMLDivElement>
}

const Wishlist: React.FC<IProps> = ({ openWishlist, setOpenWishlist, wishlistRef }) => {
  return (
    <div className={`${openWishlist ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity z-10 p-8 w-full`}>
      <div ref={wishlistRef} className={`md:w-2/3 xl:w-1/3 w-full flex flex-col max-h-[90%] bg-white rounded-lg ${openWishlist ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Your Wishlist</p>
          <AiOutlineClose onClick={() => setOpenWishlist(false)} className='cursor-pointer' />
        </div>
        <div className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='flex items-center justify-between border-b border-gray-200 pb-6'>
            <div className='flex items-center gap-6'>
              <div className='w-20 h-20 rounded-md border border-gray-300 bg-gray-200'></div>
              <div>
                <h1 className='font-semibold mb-1 text-lg'>Jeans Jacket</h1>
                <p className='text-sm text-gray-400'>Short description of Jeans Jacket goes here</p>
              </div>
            </div>
            <FaTrash className='text-red-500 cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wishlist