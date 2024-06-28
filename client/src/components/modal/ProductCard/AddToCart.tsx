import { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa6'
import { APP_NAME } from './../../../utils/constant'
import { currencyFormatter } from '../../../utils/currency'
import { IProduct, IProductColor } from '../../../utils/interface'
import { LuMinus, LuPlus } from 'react-icons/lu'
import useStore from './../../../store/store'

interface IProps {
  product: IProduct
  openAddToCartModal: boolean
  setOpenAddToCartModal: React.Dispatch<React.SetStateAction<boolean>>
  addToCartModalRef: React.MutableRefObject<HTMLDivElement>
  name: string
  discount: number
  image: string
  shortDescription: string
  price: number
  colors: IProductColor[]
  longDescription: string
}

const AddToCart: React.FC<IProps> = ({ openAddToCartModal, setOpenAddToCartModal, addToCartModalRef, name, discount, image, shortDescription, price, colors, longDescription, product }) => {
  const [selectedColor, setSelectedColor] = useState<Partial<IProductColor>>({})
  const [selectedSize, setSelectedSize] = useState({})
  const [qty, setQty] = useState(1)

  const { userState, createCart } = useStore()

  const handleSelectColor = (color: IProductColor) => {
    setSelectedColor(color)
    setSelectedSize({})
    setQty(1)
  }

  const handleSelectSize = (size: object) => {
    // @ts-ignore
    if (size.stock !== 0) {
      setSelectedSize(size)
      setQty(1)
    }
  }

  const handleChangeQty = (type: string) => {
    if (Object.keys(selectedSize).length > 0) {
      if (type === 'increase') {
        const newQty = qty + 1
        // @ts-ignore
        if (newQty > selectedSize.stock) {
          setQty(qty)
        } else {
          setQty(newQty)
        }
      } else if (type === 'decrease') {
        const newQty = qty - 1
        if (newQty < 1) {
          setQty(1)
        } else {
          setQty(newQty)
        }
      }
    }
  }

  const handleAddToCart = () => {
    // @ts-ignore 
    const findStock = (selectedColor as IProductColor).sizes.find(item => item.size === selectedSize.size)

    if (userState.data.accessToken) {
      createCart({
        product,
        qty,
        // @ts-ignore
        size: selectedSize.size,
        color: selectedColor as IProductColor,
        discount: product.discount,
        stock: findStock?.stock as number,
        selected: true
      }, userState.data.accessToken)
    } else {
      createCart({
        product,
        qty,
        // @ts-ignore
        size: selectedSize.size,
        color: selectedColor as IProductColor,
        discount: product.discount,
        stock: findStock?.stock as number,
        selected: true
      })
    }
    
    setOpenAddToCartModal(false)
  }

  useEffect(() => {
    setSelectedColor(colors[0])
  }, [colors])

  return (
    <div className={`${openAddToCartModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex z-10 items-center justify-center transition-opacity`}>
      <div ref={addToCartModalRef} className='w-[90%] bg-white rounded-md md:px-12 py-10 px-6 flex md:flex-row flex-col gap-8 md:items-center max-h-[95vh] overflow-auto'>
        <div className='flex-1 h-[580px] rounded-md border border-gray-300'>
          <img style={{ objectPosition: '50% 20%' }} src={image} alt={`${APP_NAME} Product Name`} className='w-full h-full object-cover rounded-md pointer-events-none' />
        </div>
        <div className='flex-1'>
          <div className='flex items-center gap-4'>
            <h1 className='font-medium text-3xl'>{name}</h1>
            {
              discount! > 0 &&
              <div className='bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md shadow-lg'>
                <p>{discount}% Off</p>
              </div>
            }
          </div>
          <p className='text-gray-400 text-sm mt-5'>{shortDescription}</p>
          <div className='flex items-center gap-2 mt-5'>
            <div className='flex items-centar gap-2'>
              <FaStar className='text-orange-400 text-lg' />
              <p className='text-sm'>4/5</p>
            </div>
            <p className='text-gray-500 text-sm'>(120 Reviews)</p>
          </div>
          <div className='mt-8 flex items-center justify-between'>
            {
              discount! > 0
              ? (
                <div className=''>
                  <p className='line-through text-gray-300 mb-2'>{currencyFormatter(price as number)},00</p>
                  <p className='text-2xl font-semibold'>{currencyFormatter(price! - ((discount! * price!) / 100))},00</p>
                </div>
              )
              : <p className='text-2xl font-medium'>{currencyFormatter(price as number)},00</p>
            }
            <div className='flex gap-3'>
              {
                colors?.map((item, idx) => (
                  <div key={idx} onClick={() => handleSelectColor(item)} style={{ background: item.hexCode }} className={`w-10 h-10 rounded-md cursor-pointer ${item.hexCode === selectedColor.hexCode ? 'outline outline-offset-2 outline-black' : ''} hover:outline hover:outline-offset-2 hover:outline-black transition-[outline]`} />
                ))
              }
            </div>
          </div>
          <div className='mt-10'>
            <p className='font-semibold'>Select Size:</p>
            <div className='mt-5 flex items-center gap-3 flex-wrap'>
              {
                [colors!.find(item => item.hexCode === selectedColor.hexCode)].map(item => (
                  item?.sizes.map((size, idx) => (
                    // @ts-ignore
                    <div key={idx} onClick={() => handleSelectSize(size)} className={`py-2 px-5 rounded-md w-fit ${size.stock === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-black hover:text-white cursor-pointer'} transition ${size.size === selectedSize.size ? 'bg-black text-white hover:bg-black hover:text-white' : 'bg-gray-100' }`}>
                      <p className='text-sm'>{size.size}</p>
                    </div>
                  ))
                ))
              }
            </div>
          </div>
          <hr className='my-8' />
          <div className='flex gap-5'>
            <div className='flex items-center gap-5 bg-gray-100 rounded-md w-fit px-3 py-2'>
              <LuMinus onClick={() => handleChangeQty('decrease')} className={`${Object.keys(selectedSize).length > 0 ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'}`} />
              <p className={`px-3 ${Object.keys(selectedSize).length > 0 ? 'text-black' : 'text-gray-300'}`}>{qty}</p>
              <LuPlus onClick={() => handleChangeQty('increase')} className={`cursor-pointer ${Object.keys(selectedSize).length > 0 ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'}`} />
            </div>
            <button disabled={Object.keys(selectedSize).length < 1} onClick={handleAddToCart} className={`${Object.keys(selectedSize).length > 0 ? 'bg-black hover:bg-gray-700 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'} transition text-white text-sm flex-1 rounded-md`}>Add to Cart</button>
          </div>
          <div className='mt-10'>
            <p className='font-semibold'>Description</p>
            <p className='text-sm mt-4 text-gray-400 leading-relaxed'>
              {longDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddToCart