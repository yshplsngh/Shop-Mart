import Footer from "../components/general/Footer"
import Navbar from "../components/general/Navbar"
import HeadInfo from "../utils/HeadInfo"
import useStore from './../store/store'
import CartItem from '../components/cart/CartItem'
import { currencyFormatter } from "../utils/currency"

const Cart = () => {
  const { userState, cartState, bulkUpdateCartSelectedStatus } = useStore()

  const handleClickCheckbox = () => {
    const isEveryItemChecked = cartState.data.every(item => item.selected)

    if (isEveryItemChecked) {
      if (userState.data.accessToken) {
        bulkUpdateCartSelectedStatus(false, userState.data.accessToken)
      } else {
        bulkUpdateCartSelectedStatus(false)
      }
    } else {
      if (userState.data.accessToken) {
        bulkUpdateCartSelectedStatus(true, userState.data.accessToken)
      } else {
        bulkUpdateCartSelectedStatus(true)
      }
    }
  }

  return (
    <>
      <HeadInfo title='Cart' />
      <Navbar />
      <div className='py-10 md:px-12 px-6'>
        <div>
          <h1 className='text-center text-3xl font-medium'>Shopping Cart</h1>
        </div>
        {
          cartState.data.length === 0
          ? (
            <div className='w-full bg-orange-500 rounded-md text-white font-semibold text-center p-3 mt-10 text-sm'>
              <p>Your cart is currently empty</p>
            </div>
          )
          : (
            <>
              <div className='mt-10'>
                <div className='flex items-center justify-between text-gray-600 gap-0'>
                  <div>
                    <input type='checkbox' onChange={handleClickCheckbox} checked={cartState.data.every(item => item.selected)} />
                  </div>
                  <p className='flex-[2] text-center'>Description</p>
                  <p className='flex-1 text-center md:block hidden'>Size</p>
                  <p className='flex-1 text-center md:block hidden'>Quantity</p>
                  <p className='flex-1 text-center md:block hidden'>Price</p>
                </div>
                <hr className='my-6' />
                <div className='flex flex-col gap-7'>
                  {
                    cartState.data.map((item, idx) => (
                      <CartItem
                        key={idx}
                        item={item}
                      />
                    ))
                  }
                </div>
              </div>
              <hr className='my-7' />
              <div className='flex items-center justify-between'>
                <p className='font-semibold'>Subtotal</p>
                <p className='font-semibold'>{currencyFormatter(cartState.data.reduce((acc, item) => (item.selected ? ((item.product.price - ((item.discount * item.product.price) / 100)) * item.qty) : 0) + acc, 0))},00</p>
              </div>
              <div className='flex justify-end mt-8'>
                <button disabled={cartState.data.every(item => !item.selected)} className={`${cartState.data.every(item => !item.selected) ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-700 cursor-pointer'} text-white rounded-md px-7 py-2 transition`}>Checkout</button>
              </div>
            </>
          )
        }
      </div>
      <Footer />
    </>
  )
}

export default Cart