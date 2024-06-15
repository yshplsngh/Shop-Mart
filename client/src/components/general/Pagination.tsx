import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

const Pagination = () => {
    return (
        <div className='flex items-center bg-black px-1 text-white rounded-full'>
            <div className='px-4 border-r py-3 border-gray-500 cursor-pointer'>
                <AiOutlineLeft />
            </div>
            <div className='px-6 tracking-wider text-sm'>3 OF 10</div>
            <div className='px-4 border-l py-3 border-gray-500 cursor-pointer'>
                <AiOutlineRight />
            </div>
        </div>
    )
}

export default Pagination