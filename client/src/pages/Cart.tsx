import { LuMinus, LuPlus } from 'react-icons/lu'
import Footer from "../components/general/Footer"
import Navbar from "../components/general/Navbar"
import HeadInfo from "../utils/HeadInfo"

const Cart = () => {
    return (
        <>
            <HeadInfo title='Cart' />
            <Navbar />
            <div className='py-10 md:px-12 px-6'>
                <div>
                    <h1 className='text-center text-3xl font-medium'>Shopping Cart</h1>
                </div>
                <div className='mt-10'>
                    <div className='flex items-center justify-between text-gray-600 gap-0'>
                        <p className='flex-[2] text-center'>Description</p>
                        <p className='flex-1 text-center md:block hidden'>Size</p>
                        <p className='flex-1 text-center md:block hidden'>Quantity</p>
                        <p className='flex-1 text-center md:block hidden'>Price</p>
                    </div>
                    <hr className='my-6' />
                    <div>
                        <div className='flex items-center gap-7'>
                            <div>
                                <input type='checkbox' />
                            </div>
                            <div className='flex md:flex-row flex-col md:items-center md:gap-0 gap-4 md:flex-auto flex-1'>
                                <div className='flex items-center flex-[3]'>
                                    <div className='flex items-center md:gap-7 gap-5 flex-[2]'>
                                        <div className='w-20 h-20 rounded-md bg-gray-100'></div>
                                        <div>
                                            <p className='font-medium'>Streamline Leggings <strong className='md:hidden inline-block'>(S)</strong></p>
                                            <p className='text-gray-500 text-xs mt-3'>Product Code: MLSB</p>
                                        </div>
                                    </div>
                                    <div className='flex-1 md:flex hidden justify-center md:-ml-28'>
                                        <p className='py-3 px-5 rounded-md border border-gray-400 w-fit'>S</p>
                                    </div>
                                </div>
                                <div className='flex flex-[2] md:flex-row flex-row-reverse md:gap-2 gap-5 items-center justify-between'>
                                    <div className='flex-1 flex justify-center'>
                                        <div className='flex items-center gap-5 bg-gray-100 rounded-md w-fit px-3 py-2'>
                                            <LuMinus className='cursor-pointer' />
                                            <p className='px-3'>1</p>
                                            <LuPlus className='cursor-pointer' />
                                        </div>
                                    </div>
                                    <div className='flex-1 flex md:justify-center justify-start'>
                                        <p>IDR 300.000,00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='my-7' />
                <div className='flex items-center justify-between'>
                    <p className='font-semibold'>Subtotal</p>
                    <p className='font-semibold'>IDR 300.000,00</p>
                </div>
                <div className='flex justify-end mt-8'>
                    <button className='bg-black text-white rounded-md px-7 py-2 hover:bg-gray-700 transition'>Checkout</button>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Cart