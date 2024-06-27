import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBagShopping } from 'react-icons/fa6'
import { CiHeart } from 'react-icons/ci'
import { currencyFormatter } from '../../utils/currency'
import { APP_NAME } from '../../utils/constant'
import AddToCart from '../modal/ProductCard/AddToCart'
import { IProduct, IProductColor } from '../../utils/interface'
import useStore from './../../store/store'

interface IProps {
  id: string
  name: string
  price: number
  image: string
  discount: number
  shortDescription: string
  colors: IProductColor[]
  longDescription: string
  product: IProduct
}

const ProductCard: React.FC<IProps> = ({ id, name, price, image, discount, shortDescription, colors, longDescription, product }) => {
  const [openAddToCartModal, setOpenAddToCartModal] = useState(false)
  const [itemOnCart, setItemOnCart] = useState(false)

  const addToCartModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()

  const { cartState } = useStore()

  const handleClickProduct = () => {
    window.scrollTo(0, 0)
    navigate(`/products/${id}`)
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openAddToCartModal && addToCartModalRef.current && !addToCartModalRef.current.contains(e.target as Node)) {
        setOpenAddToCartModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openAddToCartModal])

  useEffect(() => {
    if (cartState.data.find(item => item.product._id === id)) {
      setItemOnCart(true)
    } else {
      setItemOnCart(false)
    }
  }, [cartState.data, id])

  return (
    <>
      <div className=''>
        <div className='cursor-pointer w-full h-80 bg-gray-100 rounded-xl mb-6 relative'>
          {
            discount! > 0 &&
            <div className='absolute top-4 left-4 bg-red-500 text-sm px-2 py-1 rounded-md text-white font-semibold shadow-lg'>
              <p>{discount}% Off</p>
            </div>
          }
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
          <div onClick={() => setOpenAddToCartModal(true)} className={`cursor-pointer rounded-full p-2 border border-gray-800 flex items-center justify-center ${itemOnCart ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} transition`}>
            <FaBagShopping className='text-xs' />
          </div>
        </div>
      </div>

      <AddToCart
        openAddToCartModal={openAddToCartModal}
        setOpenAddToCartModal={setOpenAddToCartModal}
        addToCartModalRef={addToCartModalRef}
        name={name}
        discount={discount}
        image={image}
        shortDescription={shortDescription}
        price={price}
        colors={colors}
        longDescription={longDescription}
        product={product}
      />
    </>
  )
}

export default ProductCard