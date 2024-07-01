import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { FaRegStar, FaStar } from 'react-icons/fa6'
import { LuMinus, LuPlus } from "react-icons/lu";
import { APP_NAME } from "../../utils/constant"
import Footer from "../../components/general/Footer"
import Navbar from "../../components/general/Navbar"
import ProductCard from '../../components/general/ProductCard';
import HeadInfo from '../../utils/HeadInfo';
import { IProduct, IProductColor } from '../../utils/interface';
import { getDataAPI } from '../../utils/fetchData';
import { currencyFormatter } from '../../utils/currency';
import Loader from '../../components/general/Loader';
import Overview from '../../components/productDetail/Overview';
import SizeChart from '../../components/productDetail/SizeChart';
import useStore from './../../store/store'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';
import Review from '../../components/modal/ProductDetail/Review';
import Pagination from '../../components/general/Pagination';
import { formatDate } from '../../utils/date';

const Detail = () => {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Partial<IProduct>>({})
  const [selectedColor, setSelectedColor] = useState<Partial<IProductColor>>({})
  const [selectedSize, setSelectedSize] = useState({})
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([])
  const [itemOnWishlist, setItemOnWishlist] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [reviewEligibility, setReviewEligibility] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 9

  const [tab, setTab] = useState('overview')

  const reviewModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  
  const { slug } = useParams()

  const { userState, wishlistState, reviewState, createCart, createWishlist, readReview } = useStore()
  
  const handleAddToWishlist = () => {
    if (userState.data.accessToken) {
      createWishlist(product as IProduct, userState.data.accessToken)
    } else {
      createWishlist(product as IProduct)
    }
  }

  const handleSelectSize = (size: object) => {
    // @ts-ignore
    if (size.stock !== 0) {
      setSelectedSize(size)
      setQty(1)
    }
  }

  const handleSelectColor = (color: IProductColor) => {
    setSelectedColor(color)
    setSelectedSize({})
    setQty(1)
  }

  const handleChangeQty = (type: string) => {
    if (Object.keys(selectedSize).length > 0) {
      if (type === 'increase') {
        const newQty = qty + 1
        // @ts-ignore
        if (newQty > selectedSize.stock) {
          setQty(qty)
        } else {
          setQty(newQty)
        }
      } else if (type === 'decrease') {
        const newQty = qty - 1
        if (newQty < 1) {
          setQty(1)
        } else {
          setQty(newQty)
        }
      }
    }
  }

  const handleAddToCart = () => {
    // @ts-ignore
    const findStock = (selectedColor as IProductColor).sizes.find(item => item.size === selectedSize.size)

    if (userState.data.accessToken) {
      createCart({
        product: product as IProduct,
        qty,
        // @ts-ignore
        size: selectedSize.size,
        color: selectedColor as IProductColor,
        discount: (product as IProduct).discount,
        stock: findStock?.stock as number,
        selected: true
      }, userState.data.accessToken)
    } else {
      createCart({
        product: product as IProduct,
        qty,
        // @ts-ignore
        size: selectedSize.size,
        color: selectedColor as IProductColor,
        discount: (product as IProduct).discount,
        stock: findStock?.stock as number,
        selected: true
      })
    }
  }

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        setPage(page - 1)
      } else {
        setPage(page)
      }
    } else if (type === 'next') {
      if (page === reviewState.totalPage) {
        setPage(reviewState.totalPage)
      } else {
        setPage(page + 1)
      }
    }
  }

  useEffect(() => {
    if (product._id)
      readReview(product._id, page, limit)
  }, [readReview, product._id, page, limit])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openReviewModal && reviewModalRef.current && !reviewModalRef.current.contains(e.target as Node)) {
        setOpenReviewModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openReviewModal])

  useEffect(() => {
    const fetchProduct = async(id: string) => {
      setLoading(true)

      try {
        const res = await getDataAPI(`/product/${id}`)
        setProduct(res.data.product)
        setSelectedColor(res.data.product.colors[0])
      } catch (error) {
        setError(true)
      }

      setLoading(false)
    }

    fetchProduct(slug as string)
  }, [slug])

  useEffect(() => {
    const fetchSimilarProducts = async() => {
      const res = await getDataAPI(`/product/${slug}/similar`)
      setSimilarProducts(res.data.similarProducts)
    }

    fetchSimilarProducts()
  }, [slug])

  useEffect(() => {
    const checkReviewEligibility = async(productId: string, token: string) => {
      const res = await getDataAPI(`/review/eligibility/${productId}`, token)
      setReviewEligibility(res.data.eligibility)
    }

    if (product._id && userState.data.accessToken) {
      checkReviewEligibility(product._id, userState.data.accessToken)
    }
  }, [product, userState.data.accessToken])

  useEffect(() => {
    if (wishlistState.data.find(item => item._id === product._id)) {
      setItemOnWishlist(true)
    } else {
      setItemOnWishlist(false)
    }
  }, [wishlistState.data, product._id])
  
  return (
    <>
      <HeadInfo title='Blazer Long Sleeve' />
      <Navbar />
      {
        loading
        ? (
          <div className='my-8 flex justify-center'>
            <Loader size='xl' />
          </div>
        )
        : (
          error
          ? (
            <div className='md:px-12 px-6'>
              <div className='w-full text-center text-white text-sm py-3 my-8 bg-red-500 rounded-md'>
                <p>No records found</p>
              </div>
            </div>
          ) 
          : (
            Object.keys(product).length > 0 &&
            <div className='pt-10'>
              {/* header */}
              <div className='md:px-12 px-6 flex md:flex-row flex-col gap-8 md:items-center'>
                <div className='flex-1 h-[600px] rounded-md border border-gray-300'>
                  {
                    product.images!.length > 0 &&
                    <img style={{ objectPosition: '50% 20%' }} src={product.images![0]} alt={`${APP_NAME} Product Name`} className='w-full h-full object-cover rounded-md pointer-events-none' />
                  }
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-4'>
                    <h1 className='font-medium text-4xl'>{product.name}</h1>
                    {
                      product.discount! > 0 &&
                      <div className='bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md shadow-lg'>
                        <p>{product.discount}% Off</p>
                      </div>
                    }
                  </div>
                  <p className='text-gray-400 text-sm mt-5'>{product.shortDescription}</p>
                  <div className='flex items-center gap-2 mt-5'>
                    <div className='flex items-centar gap-2'>
                      <FaStar className='text-orange-400 text-lg' />
                      <p className='text-sm'>4/5</p>
                    </div>
                    <p className='text-gray-500 text-sm'>(120 Reviews)</p>
                  </div>
                  <div className='mt-8 flex items-center justify-between'>
                    {
                      product.discount! > 0
                      ? (
                        <div className=''>
                          <p className='line-through text-gray-300 mb-2'>{currencyFormatter(product.price as number)},00</p>
                          <p className='text-2xl font-semibold'>{currencyFormatter(product.price! - ((product.discount! * product.price!) / 100))},00</p>
                        </div>
                      )
                      : <p className='text-2xl font-medium'>{currencyFormatter(product.price as number)},00</p>
                    }
                    <div className='flex gap-3'>
                      {
                        product.colors?.map((item, idx) => (
                          <div key={idx} onClick={() => handleSelectColor(item)} style={{ background: item.hexCode }} className={`w-10 h-10 rounded-md cursor-pointer ${item.hexCode === selectedColor.hexCode ? 'outline outline-offset-2 outline-black' : ''} hover:outline hover:outline-offset-2 hover:outline-black transition-[outline]`} />
                        ))
                      }
                    </div>
                  </div>
                  <div className='mt-10'>
                    <p className='font-semibold'>Select Size:</p>
                    <div className='mt-5 flex items-center gap-3 flex-wrap'>
                      {
                        [product.colors!.find(item => item.hexCode === selectedColor.hexCode)].map(item => (
                          item?.sizes.map((size, idx) => (
                            // @ts-ignore
                            <div key={idx} onClick={() => handleSelectSize(size)} className={`py-2 px-5 rounded-md w-fit ${size.stock === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-black hover:text-white cursor-pointer'} transition ${size.size === selectedSize.size ? 'bg-black text-white hover:bg-black hover:text-white' : 'bg-gray-100' }`}>
                              <p className='text-sm'>{size.size}</p>
                            </div>
                          ))
                        ))
                      }
                    </div>
                  </div>
                  <hr className='my-8' />
                  <div className='flex items-center gap-5'>
                    <div className='flex gap-5 flex-1'>
                      <div className='flex items-center gap-5 bg-gray-100 rounded-md w-fit px-3 py-2'>
                        <LuMinus onClick={() => handleChangeQty('decrease')} className={`${Object.keys(selectedSize).length > 0 ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'}`} />
                        <p className={`px-3 ${Object.keys(selectedSize).length > 0 ? 'text-black' : 'text-gray-300'}`}>{qty}</p>
                        <LuPlus onClick={() => handleChangeQty('increase')} className={`cursor-pointer ${Object.keys(selectedSize).length > 0 ? 'cursor-pointer' : 'cursor-not-allowed text-gray-300'}`} />
                      </div>
                      <button disabled={Object.keys(selectedSize).length < 1} onClick={handleAddToCart} className={`${Object.keys(selectedSize).length > 0 ? 'bg-black hover:bg-gray-700 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'} transition text-white text-sm flex-1 rounded-md`}>Add to Cart</button>
                    </div>
                    <div onClick={handleAddToWishlist} className={`p-1 rounded-full w-fit text-x cursor-pointer ${itemOnWishlist ? 'bg-red-500 text-white' : 'bg-white text-black border border-black'}`}>
                      {
                        itemOnWishlist
                        ? <RiHeartFill />
                        : <RiHeartLine />
                      }
                    </div>
                  </div>
                  <div className='mt-10'>
                    <p className='font-semibold'>Description</p>
                    <p className='text-sm mt-4 text-gray-400 leading-relaxed'>
                      {product.longDescription}
                    </p>
                  </div>
                </div>
              </div>
              {/* middle */}
              <div className='md:px-12 px-6 mt-20'>
                <h1 className='text-center text-3xl font-medium'>Elevate Your Style</h1>
                <div className='md:w-6/12 m-auto text-center mt-6'>
                  <p className='text-gray-500 text-sm leading-loose'>Elevate your style with our {product.name}. This versatile piece effortlessly blends comfort and fashion with high-quality material and stylish design, perfect for any occasion</p>
                </div>
                <div className='bg-gray-100 rounded-full py-2 px-2 m-auto w-fit flex items-center gap-3 mt-7 cursor-pointer'>
                  <div onClick={() => setTab('overview')} className={`${tab === 'overview' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} rounded-full px-5 py-2`}>
                    <p className='text-sm'>Overview</p>
                  </div>
                  <div onClick={() => setTab('sizeChart')} className={`${tab === 'sizeChart' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} rounded-full px-5 py-2`}>
                    <p className='text-sm'>Size Chart</p>
                  </div>
                  <div onClick={() => setTab('reviews')} className={`${tab === 'reviews' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} rounded-full px-5 py-2`}>
                    <p className='text-sm'>Reviews</p>
                  </div>
                </div>
                {
                  tab === 'overview'
                  ? <Overview images={product.images as string[]} />
                  : tab === 'sizeChart'
                    // @ts-ignore
                    ? <SizeChart availableSizeParameters={(product.category.availableSizeParameters) as string[]} sizeChart={product.sizeChart}  />  
                    : tab === 'reviews'
                      ? (
                        <div className='mt-10'>
                          {
                            reviewEligibility &&
                            <div className='mb-10 flex justify-end'>
                              <button onClick={() => setOpenReviewModal(true)} className='text-white rounded-md bg-black transition hover:bg-gray-800 px-4 py-2'>Post Review</button>
                            </div>
                          }
                          <div>
                            {
                              reviewState.data.length === 0
                              ? (
                                <div className='bg-orange-500 text-white w-full rounded-md text-center py-3 font-semibold'>
                                  <p>No reviews found</p>
                                </div>
                              )
                              : (
                                <>
                                  {
                                    reviewState.data.map(item => (
                                      <div key={item._id}>
                                        <div className='flex md:flex-row flex-col md:items-center md:gap-0 gap-6 justify-between'>
                                          <div className='flex items-center gap-8'>
                                            {
                                              !item.user.avatar
                                              ? (
                                                <div className='w-20 h-20 rounded-full bg-gray-800 border border-gray-200 flex items-center justify-center'>
                                                  <p className='text-white font-bold text-4xl'>{`${item.user.name.split(' ')[0][0]} ${item.user.name.split(' ')[item.user.name.split(' ').length - 1][0]}`}</p>
                                                </div>
                                              )
                                              : (
                                                <div className='w-20 h-20 rounded-full bg-gray-100 border border-gray-200'>
                                                  <img src={item.user.avatar} alt={`${APP_NAME} - ${product.name}`} />
                                                </div>
                                              )
                                            }
                                            <div>
                                              <h1 className='text-lg font-semibold'>{item.user.name}</h1>
                                              <p className='mt-2 text-gray-500 text-sm'>{item.content}</p>
                                              <div className='flex items-center gap-1 text-lg text-orange-500 mt-4'>
                                                {
                                                  Array(item.star).fill(null).map((item, idx) => (
                                                    <FaStar key={idx} className='text-orange-500' />
                                                  ))
                                                }

                                                {
                                                  Array(5 - item.star).fill(null).map((item, idx) => (
                                                    <FaRegStar key={idx} className='text-orange-500' />
                                                  ))
                                                }
                                              </div>  
                                            </div>
                                          </div>
                                          <p className='text-gray-600 text-sm md:text-left text-right'>{formatDate(item.createdAt)}</p>
                                        </div>
                                        <hr className='my-8' />
                                      </div>
                                    ))
                                  }
                                </>
                              )
                            }
                          </div>

                          {
                            reviewState.totalPage > 1 &&
                            <div className='mt-12 flex justify-center'>
                              <Pagination
                                currentPage={page}
                                totalPage={reviewState.totalPage}
                                handleChangePage={handleChangePage}
                              />
                            </div>
                          }
                        </div>
                      )
                      : ''
                }
              </div>
              {/* recommendation */}
              <div className='mt-20 bg-gray-100 md:px-12 px-6 py-10'>
                <h1 className='text-3xl font-medium'>You may also like</h1>
                {
                  similarProducts.length > 0
                  ? (
                    <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mt-12'>
                      {
                        similarProducts.map(item => (
                          <ProductCard
                            key={item._id}
                            id={item._id}
                            image={item.images[0]}
                            name={item.name}
                            price={item.price}
                            discount={item.discount}
                            shortDescription={item.shortDescription}
                            colors={item.colors}
                            longDescription={item.longDescription}
                            product={item}
                          />
                        ))
                      }
                    </div>
                  )
                  : (
                    <div className='mt-12 bg-orange-500 rounded-md text-white text-sm py-3 w-full text-center'>
                      <p>No similar products available</p>
                    </div>
                  )
                }
              </div>
            </div>
          )
        )
      }
      <Footer />

      <Review
        openReviewModal={openReviewModal}
        setOpenReviewModal={setOpenReviewModal}
        reviewModalRef={reviewModalRef}
        product={product._id as string}
        setReviewEligibility={setReviewEligibility}
      />
    </>
  )
}

export default Detail