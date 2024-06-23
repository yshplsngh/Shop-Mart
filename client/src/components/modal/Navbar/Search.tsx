import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { currencyFormatter } from './../../../utils/currency'
import { IProduct } from '../../../utils/interface'
import { getDataAPI } from '../../../utils/fetchData'
import { APP_NAME } from '../../../utils/constant'

interface IProps {
  openSearchModal: boolean
  setOpenSearchModal: React.Dispatch<React.SetStateAction<boolean>>
  searchModalRef: React.MutableRefObject<HTMLDivElement>
}

const Search: React.FC<IProps> = ({ openSearchModal, setOpenSearchModal, searchModalRef }) => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const searchProduct = async(keyword: string) => {
      const res = await getDataAPI(`/product?search=${keyword}`)
      setProducts(res.data.product)
    }

    if (keyword.length > 3)
      searchProduct(keyword)
  }, [keyword])

  return (
    <div className={`${openSearchModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity z-10 p-10`}>
      <div ref={searchModalRef} className='xl:w-1/2 lg:w-2/3 w-full'>
        <div className={`w-full flex bg-white rounded-lg ${openSearchModal ? 'translate-y-0' : '-translate-y-10'} transition-transform gap-4 p-4 items-center`}>
          <input type='text' value={keyword} onChange={e => setKeyword(e.target.value)} placeholder='Product name ...' className='flex-1 outline-none' />
          <AiOutlineSearch className='text-xl' />
        </div>

        {
          keyword.length > 3 &&
          <div className='w-full rounded-md bg-white mt-5'>
            {
              products.length === 0
              ? (
                <div className='rounded-md bg-red-500 text-white text-center text-sm py-4'>
                  <p>No records found</p>
                </div>
              )
              :(
                products.map((item, idx) => (
                  <Link key={item._id} to={`/products/${item._id}`} className={`hover:bg-gray-200 transition ${products.length === 1 ? 'rounded-md' : idx === 0 ? 'rounded-t-md border-b border-gray-300' : idx === products.length - 1 ? 'rounded-b-md' : ''} p-5 flex items-center gap-4`}>
                    <div className='w-24 h-24 bg-gray-200 rounded-md'>
                      <img src={item.images[0]} alt={`${APP_NAME} - ${item.name}`} className='w-full h-full rounded-md object-cover border border-gray-300' />
                    </div>
                    <div>
                      <h1 className='font-semibold text-lg'>{item.name}</h1>
                      <p className='text-sm text-gray-400 mt-1'>{item.shortDescription}</p>
                      <p className='mt-3 font-semibold'>{currencyFormatter(item.price)},00</p>
                    </div>
                  </Link>
                ))
              )
            }
        </div>
        }
      </div>
    </div>
  )
}

export default Search