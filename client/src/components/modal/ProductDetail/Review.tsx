import { useState } from 'react'
import { AiOutlineClose } from "react-icons/ai"
import { FaRegStar, FaStar } from "react-icons/fa6"
import { FormSubmitted } from '../../../utils/interface'

interface IProps {
  openReviewModal: boolean
  setOpenReviewModal: React.Dispatch<React.SetStateAction<boolean>>
  reviewModalRef: React.MutableRefObject<HTMLDivElement>
}

const Review: React.FC<IProps> = ({ openReviewModal, setOpenReviewModal, reviewModalRef }) => {
  const [rating, setRating] = useState(0)
  const [star, setStar] = useState(0)
  const [content, setContent] = useState('')

  const handleSubmit = (e: FormSubmitted) => {
    e.preventDefault()
  }

  return (
    <div className={`${openReviewModal ? 'z-20 opacity-100 p-5 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.7)] flex items-center justify-center`}>
      <div ref={reviewModalRef} className={`lg:w-1/2 md:w-2/3 w-full bg-white rounded-2xl ${openReviewModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between border-b border-gray-300 py-4 px-6'>
          <h3 className='font-semibold'>Post Review</h3>
          <AiOutlineClose onClick={() => setOpenReviewModal(false)} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-3'>
          <div className='mb-8'>
            <p>Rating</p>
            <div className='mt-4 flex items-center gap-2'>
              {
                [1,2,3,4,5].map(starMap => (
                  <div key={starMap} onMouseEnter={() => setRating(starMap)} onMouseLeave={() => setRating(0)}>
                    {
                      (starMap <= rating) || (star >= starMap)
                      ? <FaStar onClick={() => setStar(starMap)} className='text-orange-500 text-2xl cursor-pointer' />
                      : <FaRegStar onClick={() => setStar(starMap)} className='text-orange-500 text-2xl cursor-pointer' />
                    }
                  </div>
                ))
              }
            </div>
          </div>
          <div className='mb-5'>
            <label htmlFor='content'>Content</label>
            <textarea name='content' id='content' className='resize-none w-full p-3 text-sm outline-none border border-gray-300 rounded-md mt-4' value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div className='flex justify-end'>
            <button disabled={star === 0 || !content} className={`${star === 0 || !content ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} text-white rounded-md transition px-5 py-2`}>Post Review</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Review