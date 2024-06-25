import { useState } from 'react'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6'
import { APP_NAME } from './../../utils/constant'

interface IProps {
  images: string[]
}

const Overview: React.FC<IProps> = ({ images }) => {
  const [image, setImage] = useState(0)

  const handleChangeImage = (type: string) => {
    if (type === 'previous') {
      const newImage = image - 1
      if (newImage < 0)
        setImage(0)
      else
        setImage(newImage)
    } else if (type === 'next') {
      const newImage = image + 1
      if (newImage > 2)
        setImage(2)
      else
        setImage(newImage)
    }
  }
  
  return (
    <>
      <div className='mt-10 lg:grid hidden grid-cols-3 gap-8 h-[500px]'>
        <div className='w-full h-full rounded-lg'>
          <img style={{ objectPosition: '50% 20%' }} src={images![0]} alt={`${APP_NAME} Product Name`} className='w-full h-[500px] rounded-lg object-cover border border-gray-300 pointer-events-none' />
        </div>
        <div className='w-full h-full rounded-lg'>
          <img style={{ objectPosition: '50% 20%' }} src={images![1]} alt={`${APP_NAME} Product Name`} className='w-full h-[500px] rounded-lg object-cover border border-gray-300 pointer-events-none' />
        </div>
        <div className='w-full h-full rounded-lg'>
          <img style={{ objectPosition: '50% 20%' }} src={images![2]} alt={`${APP_NAME} Product Name`} className='w-full h-[500px] rounded-lg object-cover border border-gray-300 pointer-events-none' />
        </div>
      </div>

      <div className='mt-10 lg:hidden h-[500px] flex items-center gap-3'>
        <div onClick={() => handleChangeImage('previous')} className={`${image === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-black cursor-pointer'} text-white rounded-lg p-3 text-xl`}>
          <FaCaretLeft />
        </div>
        <div className='w-full h-full rounded-lg'>
          <img style={{ objectPosition: '50% 20%' }} src={images![image]} alt={`${APP_NAME} Product Name`} className='w-full h-full rounded-lg object-cover border border-gray-300 pointer-events-none' />
        </div>
        <div onClick={() => handleChangeImage('next')} className={`${image === images.length - 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-black cursor-pointer'} text-white rounded-lg p-3 text-xl`}>
          <FaCaretRight />
        </div>
      </div>
    </>
  )
}

export default Overview