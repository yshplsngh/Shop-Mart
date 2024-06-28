import { useState, useEffect, useRef } from 'react'
import { ICart, IProduct } from './../../utils/interface'
import { APP_NAME } from './../../utils/constant'
import { LuMinus, LuPlus } from 'react-icons/lu'
import { getDataAPI } from '../../utils/fetchData'
import { currencyFormatter } from '../../utils/currency'
import { FaTrash } from 'react-icons/fa6'
import useStore from './../../store/store'
import Delete from '../modal/Delete'

interface IProps {
  item: ICart
}

const CartItem: React.FC<IProps> = ({ item }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [product, setProduct] = useState<Partial<IProduct>>({})
  const [activeCheckbox, setActiveCheckbox] = useState(false)

  const deleteModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const { userState, cartState, createCart, deleteCart, updateCartSelectedStatus } = useStore()

  const handleChangeQty = (type: string) => {
    const color = product.colors!.find(currColor => currColor.hexCode === item.color.hexCode)
    const stock = color?.sizes.find(currSize => currSize.size === item.size)

    if (type === 'decrease') {
      const newQty = item.qty - 1

      if (newQty > 0) {
        if (userState.data.accessToken) {
          createCart({
            product: product as IProduct,
            qty: newQty,
            size: item.size,
            color: item.color,
            discount: product.discount as number,
            stock: stock?.stock as number,
            selected: true
          }, userState.data.accessToken)
        } else {
          createCart({
            product: product as IProduct,
            qty: newQty,
            size: item.size,
            color: item.color,
            discount: product.discount as number,
            stock: stock?.stock as number,
            selected: true
          })
        }
      }
    } else if (type === 'increase') {
      const newQty = item.qty + 1

      if (newQty > (stock?.stock as number)) {
        if (userState.data.accessToken) {
          createCart({
            product: product as IProduct,
            qty: stock?.stock as number,
            size: item.size,
            color: item.color,
            discount: product.discount as number,
            stock: stock?.stock as number,
            selected: true
          }, userState.data.accessToken)
        } else {
          createCart({
            product: product as IProduct,
            qty: stock?.stock as number,
            size: item.size,
            color: item.color,
            discount: product.discount as number,
            stock: stock?.stock as number,
            selected: true
          })
        }
      } else {
        if (userState.data.accessToken) {
          createCart({
            product: product as IProduct,
            qty: newQty,
            size: item.size,
            color: item.color,
            discount: product.discount as number,
            stock: stock?.stock as number,
            selected: true
          }, userState.data.accessToken)
        } else {
          createCart({
            product: product as IProduct,
            qty: newQty,
            size: item.size,
            color: item.color,
            discount: product.discount as number,
            stock: stock?.stock as number,
            selected: true
          })
        }
      }
    }
  }

  const handleDeleteItem = () => {
    if (userState.data.accessToken) {
      deleteCart(item, userState.data.accessToken)
    } else {
      deleteCart(item)
    }
    
    setOpenDeleteModal(false)
  }

  const handleClickCheckbox = () => {
    if (userState.data.accessToken) {
      updateCartSelectedStatus(item, userState.data.accessToken)
    } else {
      updateCartSelectedStatus(item)
    }
  }

  useEffect(() => {
    const fetchProduct = async() => {
      const res = await getDataAPI(`/product/${item.product._id}`)
      setProduct(res.data.product)
    }

    fetchProduct()
  }, [item])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setOpenDeleteModal(false)
      }
    }
    
    document.addEventListener('mousedown', checkIfClickedOutside)
    return document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDeleteModal])

  useEffect(() => {
    const findItem = cartState.data.find(currItem => currItem.size === item.size && currItem.color.hexCode === item.color.hexCode && currItem.product._id === item.product._id && currItem.selected === true)

    if (findItem)
      setActiveCheckbox(true)
    else
      setActiveCheckbox(false)
  }, [cartState.data, item])

  return (
    <>
      <div className='flex items-center gap-7'>
        <div>
          <input type='checkbox' onChange={handleClickCheckbox} checked={activeCheckbox} />
        </div>
        <div className='flex md:flex-row flex-col md:items-center md:gap-0 gap-4 md:flex-auto flex-1'>
          <div className='flex items-center flex-[3]'>
            <div className='flex items-center md:gap-7 gap-5 flex-[2]'>
              <div className='w-20 h-20 rounded-md bg-gray-100 border border-gray-300'>
                <img src={item.product.images[0]} alt={`${APP_NAME} - ${item.product.name}`} className='w-full h-full rounded-md object-cover' />
              </div>
              <div>
                <div className='flex items-center gap-4'>
                  <p className='font-medium'>{item.product.name} <strong className='md:hidden inline-block'>({item.size})</strong></p>
                  {
                    product.discount! > 0 &&
                    <div className='bg-red-500 rounded-md text-xs text-white p-2 font-bold'>
                      <p>{product.discount}% Off</p>
                    </div>
                  }
                </div>
                <p className='text-gray-500 text-xs mt-3'>Color: {item.color.colorName}</p>
              </div>
            </div>
            <div className='flex-1 md:flex hidden justify-center md:-ml-28'>
              <p className='py-3 px-5 rounded-md border border-gray-400 w-fit'>{item.size}</p>
            </div>
          </div>
          <div className='flex flex-[2] md:flex-row flex-row-reverse md:gap-2 gap-5 items-center justify-between'>
            <div className='flex-1 flex flex-col items-center justify-center'>
              <div className='flex items-center gap-5 bg-gray-100 rounded-md w-fit px-3 py-2'>
                <LuMinus onClick={() => handleChangeQty('decrease')} className='cursor-pointer' />
                <p className='px-3'>{item.qty}</p>
                <LuPlus onClick={() => handleChangeQty('increase')} className='cursor-pointer' />
              </div>
              <div onClick={() => setOpenDeleteModal(true)} className='text-sm flex items-center gap-2 mt-2 cursor-pointer'>
                <FaTrash className='text-red-500' />
                <p className='text-red-500'>Delete</p>
              </div>
            </div>
            <div className='flex-1 flex md:justify-center justify-start'>
              <p>{currencyFormatter((product.price! - ((product.discount! * product.price!) / 100)) * item.qty)},00</p>
            </div>
          </div>
        </div>
      </div>

      <Delete
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        handleDelete={handleDeleteItem}
        name={item.product.name}
        entity='from cart'
        removeSelectedItem={() => {}}
      />
    </>
  )
}

export default CartItem