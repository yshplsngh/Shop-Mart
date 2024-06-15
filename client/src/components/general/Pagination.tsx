import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

interface IProps {
  currentPage: number
  totalPage: number
  handleChangePage: (type: string) => void
}

const Pagination: React.FC<IProps> = ({ currentPage, totalPage, handleChangePage }) => {
  return (
    <div className='flex items-center bg-black px-1 text-white rounded-full'>
      <div onClick={() => handleChangePage('previous')} className='px-4 border-r py-3 border-gray-500 cursor-pointer'>
        <AiOutlineLeft />
      </div>
      <div className='px-6 tracking-wider text-sm'>{currentPage} OF {totalPage}</div>
      <div onClick={() => handleChangePage('next')} className='px-4 border-l py-3 border-gray-500 cursor-pointer'>
        <AiOutlineRight />
      </div>
    </div>
  )
}

export default Pagination