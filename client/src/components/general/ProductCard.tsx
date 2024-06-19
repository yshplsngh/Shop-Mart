import { useNavigate } from 'react-router-dom'
import { FaBagShopping } from 'react-icons/fa6'
import { CiHeart } from 'react-icons/ci'
import { currencyFormatter } from '../../utils/currency'
import { APP_NAME } from '../../utils/constant'

interface IProps {
  id: string
  name: string
  price: number
  image: string
}

const ProductCard: React.FC<IProps> = ({ id, name, price, image }) => {
  const navigate = useNavigate()

  const handleClickProduct = () => {
    window.scrollTo(0, 0)
    navigate(`/products/${id}`)
  }

  return (
    <div className=''>
      <div className='cursor-pointer w-full h-80 bg-gray-100 rounded-xl mb-6 relative'>
        <div className='p-1 bg-white rounded-full w-fit text-2xl absolute top-4 right-5 cursor-pointer'>
          <CiHeart />
        </div>
        <div onClick={handleClickProduct} className='w-full h-full'>
          <img style={{ objectPosition: '50% 20%' }} src={image} alt={`${APP_NAME} - ${name}`} className='cursor-pointer w-full h-full object-cover pointer-events-none rounded-xl border border-gray-200' />
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div>
          <p onClick={handleClickProduct} className='mb-2 cursor-pointer'>{name}</p>
          <p onClick={handleClickProduct} className='font-semibold cursor-pointer'>{currencyFormatter(price)}</p>
        </div>
        <div className='cursor-pointer rounded-full p-2 border border-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition'>
          <FaBagShopping className='text-xs' />
        </div>
      </div>
    </div>
  )
}

export default ProductCard