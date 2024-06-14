import { FaBagShopping } from 'react-icons/fa6'
import { CiHeart } from 'react-icons/ci'

const ProductCard = () => {
  return (
    <div className=''>
      <div className='w-full h-80 bg-gray-100 rounded-xl mb-6 relative'>
        <div className='p-1 bg-white rounded-full w-fit text-2xl absolute top-4 right-5 cursor-pointer'>
          <CiHeart />
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div>
          <p className='mb-2'>Product Item</p>
          <p className='font-semibold'>Rp.12.000,00</p>
        </div>
        <div className='cursor-pointer rounded-full p-2 border border-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition'>
          <FaBagShopping className='text-xs' />
        </div>
      </div>
    </div>
  )
}

export default ProductCard