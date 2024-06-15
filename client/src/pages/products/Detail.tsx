import { FaStar } from 'react-icons/fa6'
import { LuMinus, LuPlus } from "react-icons/lu";
import { APP_NAME } from "../../utils/constant"
import Footer from "../../components/general/Footer"
import Navbar from "../../components/general/Navbar"
import ProductCard from '../../components/general/ProductCard';
import HeadInfo from '../../utils/HeadInfo';

const Detail = () => {
  return (
    <>
      <HeadInfo title='Blazer Long Sleeve' />
      <Navbar />
      <div className='pt-10'>
        {/* header */}
        <div className='md:px-12 px-6 flex md:flex-row flex-col gap-8 md:items-center'>
          <div className='flex-1 h-[600px] rounded-md'>
            <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/login.jpg`} alt={`${APP_NAME} Product Name`} className='w-full h-full object-cover rounded-md' />
          </div>
          <div className='flex-1'>
            <h1 className='font-medium text-4xl'>Blazer Long Sleeve</h1>
            <p className='text-gray-400 text-sm mt-5'>Distinctive blazer piece, featuring a cropped sillhoutte for a stylish and comfortable edge.</p>
            <div className='flex items-center gap-2 mt-5'>
              <div className='flex items-centar gap-2'>
                <FaStar className='text-orange-400 text-lg' />
                <p className='text-sm'>4/5</p>
              </div>
              <p className='text-gray-500 text-sm'>(120 Reviews)</p>
            </div>
            <div className='mt-8 flex items-center justify-between'>
              <p className='text-2xl font-medium'>IDR 300.000,00</p>
              <div className='flex gap-3'>
                <div className='w-10 h-10 rounded-md bg-red-400 cursor-pointer hover:outline hover:outline-offset-2 hover:outline-black transition-[outline]' />
                <div className='w-10 h-10 rounded-md bg-red-400 cursor-pointer hover:outline hover:outline-offset-2 hover:outline-black transition-[outline]' />
                <div className='w-10 h-10 rounded-md bg-red-400 cursor-pointer hover:outline hover:outline-offset-2 hover:outline-black transition-[outline]' />
              </div>
            </div>
            <div className='mt-10'>
              <p className='font-semibold'>Select Size:</p>
              <div className='mt-5 flex items-center gap-3 flex-wrap'>
                <div className='py-2 px-5 bg-gray-100 rounded-md w-fit cursor-pointer hover:bg-black hover:text-white transition'>
                  <p className='text-sm'>X-Small</p>
                </div>
                <div className='py-2 px-5 bg-gray-100 rounded-md w-fit cursor-pointer hover:bg-black hover:text-white transition'>
                  <p className='text-sm'>Small</p>
                </div>
                <div className='py-2 px-5 bg-gray-100 rounded-md w-fit cursor-pointer hover:bg-black hover:text-white transition'>
                  <p className='text-sm'>Medium</p>
                </div>
                <div className='py-2 px-5 bg-gray-100 rounded-md w-fit cursor-pointer hover:bg-black hover:text-white transition'>
                  <p className='text-sm'>Large</p>
                </div>
                <div className='py-2 px-5 bg-gray-100 rounded-md w-fit cursor-pointer hover:bg-black hover:text-white transition'>
                  <p className='text-sm'>X-Large</p>
                </div>
                <div className='py-2 px-5 bg-gray-100 rounded-md w-fit cursor-pointer hover:bg-black hover:text-white transition'>
                  <p className='text-sm'>XX-Large</p>
                </div>
              </div>
            </div>
            <hr className='my-8' />
            <div className='flex gap-5'>
              <div className='flex items-center gap-5 bg-gray-100 rounded-md w-fit px-3 py-2'>
                <LuMinus className='cursor-pointer' />
                <p className='px-3'>1</p>
                <LuPlus className='cursor-pointer' />
              </div>
              <button className='bg-black hover:bg-gray-700 transition text-white text-sm flex-1 rounded-md'>Add to Cart</button>
            </div>
            <div className='mt-10'>
              <p className='font-semibold'>Description</p>
              <p className='text-sm mt-4 text-gray-400 leading-relaxed'>
                Introducing our Blazer Long Sleeve, a versatile and stylish addition to your wardrobe that effortlessly blends comfort with fashion. Crafted for everyday wear and special occasions, this jacket is designed to offer exceptional quality and on-trend style. The high-quality denim ensures day-long comfort, making it the perfect choice for a range of activities.
              </p>
            </div>
          </div>
        </div>
        {/* middle */}
        <div className='md:px-12 px-6 mt-20'>
          <h1 className='text-center text-3xl font-medium'>Elevate Your Style</h1>
          <div className='md:w-6/12 m-auto text-center mt-6'>
            <p className='text-gray-500 text-sm leading-loose'>Elevate your style with our Blazer Long Sleeve. This versatile piece effortlessly blends comfort and fashion with high-quality material and stylish design, perfect for any occasion</p>
          </div>
          <div className='bg-gray-100 rounded-full py-2 px-2 m-auto w-fit flex items-center gap-3 mt-7 cursor-pointer'>
            <div className='bg-black rounded-full text-white px-5 py-2'>
              <p className='text-sm'>Overview</p>
            </div>
            <div className='rounded-full px-5 py-2 hover:bg-black hover:text-white transition cursor-pointer'>
              <p className='text-sm'>Size Chart</p>
            </div>
            <div className='rounded-full px-5 py-2 hover:bg-black hover:text-white transition cursor-pointer'>
              <p className='text-sm'>Reviews</p>
            </div>
          </div>
          <div className='mt-10 grid grid-cols-3 gap-8 h-[500px]'>
            <div className='w-full h-full rounded-lg'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/login.jpg`} alt={`${APP_NAME} Product Name`} className='w-full h-full rounded-lg object-cover' />
            </div>
            <div className='w-full h-full rounded-lg'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/login.jpg`} alt={`${APP_NAME} Product Name`} className='w-full h-full rounded-lg object-cover' />
            </div>
            <div className='w-full h-full rounded-lg'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/login.jpg`} alt={`${APP_NAME} Product Name`} className='w-full h-full rounded-lg object-cover' />
            </div>
          </div>
        </div>
        {/* recommendation */}
        <div className='mt-20 bg-gray-100 md:px-12 px-6 py-10'>
          <h1 className='text-3xl font-medium'>You may also like</h1>
          <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mt-12'>
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Detail