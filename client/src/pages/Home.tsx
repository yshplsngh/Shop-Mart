import { Link } from 'react-router-dom'
import { APP_NAME } from './../utils/constant'
import ProductCard from './../components/general/ProductCard'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'
import Footer from './../components/general/Footer'

const Home = () => {
  return (
    <>
      <HeadInfo title='Home' />
      <Navbar />
      <div className='w-full h-[35rem] bg-gray-100 mb-12 relative'>
        <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/home.jpg`} alt={`${APP_NAME} Home Page`} className='w-full h-full object-cover' />
        <div className='absolute w-full h-full bg-[rgba(0,0,0,.6)] top-0 left-0' />
        <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white'>
          <h1 style={{ wordSpacing: '10px' }} className='text-6xl tracking-widest font-semibold text-center'>MINIMALIST STYLE</h1>
          <p className='text-center text-gray-300 mt-6 text-lg'>When less is more, when classy meets elegansy</p>
          <div className='mt-8 flex justify-center'>
            <Link to='/' className='px-10 py-3 text-sm bg-white text-black font-semibold shadow-xl rounded-full'>Explore Products</Link>
          </div>
        </div>
      </div>
      <div className='md:px-12 px-6 md:mb-28 mb-16'>
        <h1 className='text-center text-4xl font-semibold'>Best Seller</h1>
        <p className='text-sm text-gray-400 text-center mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati eos consequuntur itaque quam illo.</p>
        <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mt-12'>
          {/* <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard /> */}
        </div>
      </div>
      <div className='md:px-12 px-6 md:mb-28 mb-16 flex md:flex-row flex-col items-center justify-between md:gap-14 gap-7'>
        <div className='flex-[2] h-[25rem] bg-gray-100 rounded-lg relative'>
          <img src={`${process.env.PUBLIC_URL}/images/photos/home_outlet.jpg`} alt={`${APP_NAME} Offline Store`} className='w-full h-full object-cover rounded-lg' />
          <div className='absolute w-full h-full bg-[rgba(0,0,0,.5)] top-0 left-0 rounded-lg' />
          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white w-full text-center'>
            <h1 style={{ wordSpacing: '10px' }} className='text-5xl tracking-widest font-semibold'>JAKARTA, INDONESIA</h1>
          </div>
        </div>
        <div className='flex-1'>
          <h1 className='font-semibold text-3xl leading-relaxed'>Find Your Perfect Look at {APP_NAME} Outlet on Jakarta</h1>
          <p className='text-gray-400 text-sm leading-loose mt-5'>Welcome to the newest {APP_NAME} outlet in Jakarta, Indonesia! Step into our stylish and trendy store and discover the latest fashion and apparel. Come and experience the unique and vibrant atmosphere.</p>
        </div>
      </div>
      <div className='md:px-12 px-6 md:mb-28 mb-20'>
        <h1 className='text-center text-4xl font-semibold'>Featured Collections</h1>
        <p className='text-sm text-gray-400 text-center mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati eos consequuntur itaque quam illo.</p>
        <div className='grid md:grid-cols-3 grid-cols-1 xl:gap-16 md:gap-10 gap-8 mt-12 md:h-[40rem]'>
          <div className='flex flex-col md:gap-5 gap-8'>
            <div className='w-full md:h-[60%] h-[20rem] bg-gray-100 rounded-md'></div>
            <div className='w-full md:h-[40%] h-[20rem] bg-gray-100 rounded-md'></div>
          </div>
          <div className='flex flex-col md:gap-5 gap-8'>
            <div className='w-full md:h-[40%] h-[20rem] bg-gray-100 rounded-md'></div>
            <div className='w-full md:h-[60%] h-[20rem] bg-gray-100 rounded-md'></div>
          </div>
          <div className='flex flex-col md:gap-5 gap-8'>
            <div className='w-full md:h-[60%] h-[20rem] bg-gray-100 rounded-md'></div>
            <div className='w-full md:h-[40%] h-[20rem] bg-gray-100 rounded-md'></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home