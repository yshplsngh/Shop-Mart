import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { APP_NAME } from './../utils/constant'
import ProductCard from './../components/general/ProductCard'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'
import Footer from './../components/general/Footer'
import { IOwnerPick } from '../utils/interface'
import { getDataAPI } from '../utils/fetchData'

const Home = () => {
  const [ownerPicks, setOwnerPicks] = useState<IOwnerPick[]>([])

  const navigate = useNavigate()

  const handleClickCategory = (id: string) => {
    window.scrollTo(0, 0)
    navigate(`/products?page=1&category=${id}`)
  }

  useEffect(() => {
    const fetchOwnerPicks = async() => {
      const res = await getDataAPI('/ownerPick')
      setOwnerPicks(res.data.ownerPick)
    }

    fetchOwnerPicks()
  }, [])

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
            <Link to='/products' className='px-10 py-3 text-sm bg-white text-black font-semibold shadow-xl rounded-full'>Explore Products</Link>
          </div>
        </div>
      </div>
      <div className='md:px-12 px-6 md:mb-28 mb-16'>
        <h1 className='text-center text-4xl font-semibold'>Owner's Pick</h1>
        <p className='text-sm text-gray-400 text-center mt-4'>Explore Our Owner's Personal Selections: Handpicked with Care for Your Enjoyment!</p>
        <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mt-12'>
          {
            ownerPicks.map(item => (
              <ProductCard
                key={item.product._id}
                id={item.product._id}
                image={item.product.images[0]}
                name={item.product.name}
                price={item.product.price}
                discount={item.product.discount}
                shortDescription={item.product.shortDescription}
                colors={item.product.colors}
                longDescription={item.product.longDescription}
                product={item.product}
              />
            ))
          }
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
        <p className='text-sm text-gray-400 text-center mt-4'>Explore handpicked 'Featured Collections' designed to delight every taste and need</p>
        <div className='grid md:grid-cols-3 grid-cols-1 xl:gap-16 md:gap-10 gap-8 mt-12 md:h-[40rem]'>
          <div className='flex flex-col md:gap-5 gap-8'>
            <div onClick={() => handleClickCategory('65994a70c814ee6f9050aae6')} className='w-full md:h-[60%] h-[20rem] bg-gray-100 rounded-md relative cursor-pointer'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/jackets.jpg`} alt={`${APP_NAME} - Jackets`} className='absolute top-0 left-0 object-cover w-full h-full rounded-md' />
              <div className='absolute w-full h-full bg-[rgba(0,0,0,.3)] top-0 left-0 rounded-md' />
              <h1 className='font-semibold tracking-widest text-white z-10 text-2xl absolute bottom-10 left-1/2 -translate-x-1/2'>JACKETS</h1>
            </div>
            <div onClick={() => handleClickCategory('65994b36c814ee6f9050aaf4')} className='w-full md:h-[40%] h-[20rem] bg-gray-100 rounded-md relative cursor-pointer'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/tshirt.jpg`} alt={`${APP_NAME} - T-Shirts`} className='object-cover w-full h-full rounded-md' />
              <div className='absolute w-full h-full bg-[rgba(0,0,0,.6)] top-0 left-0 rounded-md' />
              <h1 className='font-semibold tracking-widest text-white z-10 text-2xl absolute bottom-10 left-1/2 -translate-x-1/2'>T-SHIRTS</h1>
            </div>
          </div>
          <div className='flex flex-col md:gap-5 gap-8'>
            <div onClick={() => handleClickCategory('65994d41c814ee6f9050ab18')} className='w-full md:h-[40%] h-[20rem] bg-gray-100 rounded-md relative cursor-pointer'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/footwear.jpg`} alt={`${APP_NAME} - Footwear`} className='object-cover w-full h-full rounded-md absolute top-0 left-0' />
              <div className='absolute w-full h-full bg-[rgba(0,0,0,.3)] top-0 left-0 rounded-md' />
              <h1 className='font-semibold tracking-widest text-white z-10 text-2xl absolute bottom-10 left-1/2 -translate-x-1/2'>FOOTWEAR</h1>
            </div>
            <div onClick={() => handleClickCategory('65994beac814ee6f9050aafb')} className='w-full md:h-[60%] h-[20rem] bg-gray-100 rounded-md relative cursor-pointer'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/bottoms.jpg`} alt={`${APP_NAME} - Bottoms`} className='object-cover w-full h-full rounded-md absolute top-0 left-0' />
              <div className='absolute w-full h-full bg-[rgba(0,0,0,.3)] top-0 left-0 rounded-md' />
              <h1 className='font-semibold tracking-widest text-white z-10 text-2xl absolute bottom-10 left-1/2 -translate-x-1/2'>BOTTOMS</h1>
            </div>
          </div>
          <div className='flex flex-col md:gap-5 gap-8'>
            <div onClick={() => handleClickCategory('65994e11c814ee6f9050ab23')} className='w-full md:h-[60%] h-[20rem] bg-gray-100 rounded-md relative cursor-pointer'>
              <img style={{ objectPosition: '50% 20%' }} src={`${process.env.PUBLIC_URL}/images/photos/knitwear.jpg`} alt={`${APP_NAME} - Knitwear`} className='object-cover w-full h-full rounded-md absolute top-0 left-0' />
              <div className='absolute w-full h-full bg-[rgba(0,0,0,.2)] top-0 left-0 rounded-md' />
              <h1 className='font-semibold tracking-widest text-white z-10 text-2xl absolute bottom-10 left-1/2 -translate-x-1/2'>KNITWEAR</h1>
            </div>
            <div onClick={() => handleClickCategory('65994e8ac814ee6f9050ab2a')} className='w-full md:h-[40%] h-[20rem] bg-gray-100 rounded-md relative cursor-pointer'>
              <img style={{ objectPosition: '50% 45%' }} src={`${process.env.PUBLIC_URL}/images/photos/croptop.jpg`} alt={`${APP_NAME} - Crop Top`} className='object-cover w-full h-full rounded-md absolute top-0 left-0' />
              <div className='absolute w-full h-full bg-[rgba(0,0,0,.2)] top-0 left-0 rounded-md' />
              <h1 className='font-semibold tracking-widest text-white z-10 text-2xl absolute bottom-10 left-1/2 -translate-x-1/2'>CROP TOP</h1>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home