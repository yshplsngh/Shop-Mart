import { useNavigate } from 'react-router-dom'
import { IProduct } from './../../utils/interface'
import { APP_NAME } from '../../utils/constant'
import { FaTrash } from 'react-icons/fa6'
import useStore from './../../store/store'

interface IProps {
  item: IProduct
}

const WishlistItem: React.FC<IProps> = ({ item }) => {
  const { userState, deleteWishlist } = useStore()
  
  const navigate = useNavigate()

  const handleClickDelete = () => {
    if (userState.data.accessToken) {
      deleteWishlist(item._id, userState.data.accessToken)
    } else {
      deleteWishlist(item._id)
    }
  }

  return (
    <div className={`flex items-center justify-between border-b border-gray-200 py-6`}>
      <div onClick={() => navigate(`/products/${item._id}`)} className='flex items-center gap-6 cursor-pointer'>
        <div className='w-20 h-20 rounded-md border border-gray-300 bg-gray-200'>
          <img src={item.images[0]} alt={`${APP_NAME} - ${item.name}`} className='w-full h-full object-cover rounded-md' />
        </div>
        <div>
          <h1 className='font-semibold mb-1 text-lg'>{item.name}</h1>
          <p className='text-sm text-gray-400'>{item.shortDescription}</p>
        </div>
      </div>
      <FaTrash onClick={handleClickDelete} className='text-red-500 cursor-pointer' />
    </div>
  )
}

export default WishlistItem