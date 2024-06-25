import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ICategory, IProduct } from './../../utils/interface'
import Footer from './../../components/general/Footer'
import Navbar from './../../components/general/Navbar'
import Pagination from './../../components/general/Pagination'
import ProductCard from './../../components/general/ProductCard'
import HeadInfo from './../../utils/HeadInfo'
import { getDataAPI } from '../../utils/fetchData'
import Loader from '../../components/general/Loader'

const Products = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [totalData, setTotalData] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const page = Number(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''
  const limit = 6

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        navigate(`/products?page=${page - 1}&category=${category}`)
      } else {
        navigate(`/products?page=${page}&category=${category}`)
      }
    } else if (type === 'next') {
      if (page === totalPage) {
        navigate(`/products?page=${totalPage}&category=${category}`)
      } else {
        navigate(`/products?page=${page + 1}&category=${category}`)
      }
    }
  }

  useEffect(() => {
    const fetchProducts = async(page: number, category: string) => {
      const url = category ? `/product?page=${page}&limit=${limit}&category=${category}` : `/product?page=${page}&limit=${limit}`
      
      setLoading(true)
      const res = await getDataAPI(url)
      setLoading(false)
      setProducts(res.data.product)
      setTotalData(res.data.totalData)
      setTotalPage(res.data.totalPage)
    }

    fetchProducts(page, category)
  }, [page, limit, category])

  useEffect(() => {
    const fetchCategories = async() => {
      const res = await getDataAPI('/category/all')
      setCategories(res.data.category)
    }

    fetchCategories()
  }, [])
  
  return (
    <>
      <HeadInfo title='Browse Products' />
      <Navbar />
      <div className='py-10 md:px-12 px-6'>
        {/* header */}
        <div>
          <h1 className='text-center text-3xl font-medium'>Browse Products</h1>
          <p className='text-center text-gray-500 mt-5 text-sm leading-loose'>Check this latest drop on this week! Our new arrivals are built to withstand your activities while keeping you looking your best!</p>
        </div>
        {/* filter */}
        <div className='mt-12'>
          <div className='flex items-center justify-center gap-3 flex-wrap'>
            <div onClick={() => navigate(`/products?page=${1}`)} className={`rounded-full px-5 py-2 ${category === '' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-black text-gray-500 hover:text-white'} transition cursor-pointer`}>
              <p className='text-sm'>All</p>
            </div>
            {
              categories.map(item => (
                <div key={item._id} onClick={() => navigate(`/products?page=${1}&category=${item._id}`)} className={`rounded-full px-5 py-2 ${item._id === category ? 'bg-black text-white' : 'bg-gray-100 hover:bg-black text-gray-500 hover:text-white'} transition cursor-pointer`}>
                  <p className='text-sm'>{item.name}</p>
                </div>
              ))
            }
          </div>
          <p className='text-sm text-gray-500 text-center mt-6'>({totalData} Products Available)</p>
        </div>
        {/* product list */}
        <div className='mt-12'>
          {
            loading
            ? (
              <div className='mt-8 flex justify-center'>
                <Loader size='xl' />
              </div>
            )
            : (
              products.length === 0
              ? (
                <div className='bg-red-500 rounded-md text-center text-white font-bold py-3 text-sm'>
                  <p>No records found</p>
                </div>
              )
              : (
                <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
                  {
                    products.map(item => (
                      <ProductCard
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.images[0]}
                        discount={item.discount}
                      />
                    ))
                  }
                </div>
              )
            )
          }
          
          {
            totalPage > 1 &&
            <div className='mt-16 flex justify-center'>
              <Pagination
                currentPage={page}
                totalPage={totalPage}
                handleChangePage={handleChangePage}
              />
            </div>
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Products