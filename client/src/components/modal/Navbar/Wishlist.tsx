import { AiOutlineClose } from "react-icons/ai"
import useStore from './../../../store/store'
import WishlistItem from "../../wishlist/WishlistItem"

interface IProps {
  openWishlist: boolean
  setOpenWishlist: React.Dispatch<React.SetStateAction<boolean>>
  wishlistRef: React.MutableRefObject<HTMLDivElement>
}

const Wishlist: React.FC<IProps> = ({ openWishlist, setOpenWishlist, wishlistRef }) => {
  const { wishlistState } = useStore()

  return (
    <div className={`${openWishlist ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity z-10 p-8 w-full`}>
      <div ref={wishlistRef} className={`md:w-1/2 w-full flex flex-col max-h-[90%] bg-white rounded-lg ${openWishlist ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Your Wishlist</p>
          <AiOutlineClose onClick={() => setOpenWishlist(false)} className='cursor-pointer' />
        </div>
        <div className='px-6 pb-5 hide-scrollbar overflow-auto flex-1'>
          {
            wishlistState.data.length === 0
            ? (
              <div className='w-full bg-orange-500 rounded-md text-white font-semibold text-center p-3 text-sm mt-5'>
                <p>Your wishlist is currently empty</p>
              </div>
            )
            : (
              <>
                {
                  wishlistState.data.map(item => (
                    <WishlistItem key={item._id} item={item} />
                  ))
                }
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Wishlist