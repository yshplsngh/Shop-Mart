import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai"
import { FormChanged, FormSubmitted, IProduct, IProductDiscount } from "../../../utils/interface"
import { getDataAPI } from '../../../utils/fetchData'
import useStore from './../../../store/store'

interface IProps {
  openUpsertProductDiscountModal: boolean
  setOpenUpsertProductDiscountModal: React.Dispatch<React.SetStateAction<boolean>>
  upsertProductDiscountModalRef: React.MutableRefObject<HTMLDivElement>
  setActiveDiscount: React.Dispatch<React.SetStateAction<boolean>>
  selectedProductDiscount: Partial<IProductDiscount>
  setSelectedProductDiscount: React.Dispatch<React.SetStateAction<Partial<IProductDiscount>>>
}

const UpsertProductDiscount: React.FC<IProps> = ({ openUpsertProductDiscountModal, setOpenUpsertProductDiscountModal, upsertProductDiscountModalRef, setActiveDiscount, selectedProductDiscount, setSelectedProductDiscount }) => {
  const [loading, setLoading] = useState(false)
  
  const [selectedProduct, setSelectedProduct] = useState<Partial<IProduct>>({})
  const [productData, setProductData] = useState<IProduct[]>([])
  const [productKeyword, setProductKeyword] = useState('')

  const navigate = useNavigate()

  const [productDiscountData, setProductDiscountData] = useState({
    product: '',
    percentage: 0,
    startDate: '',
    endDate: ''
  })

  const { userState, createProductDiscount, updateProductDiscount } = useStore()

  const handleClickProduct = (item: IProduct) => {
    setSelectedProduct(item)
    setProductDiscountData({ ...productDiscountData, product: item._id })
    setProductKeyword('')
  }

  const handleRemoveProduct = () => {
    setSelectedProduct({})
    setProductDiscountData({ ...productDiscountData, product: '' })
  }

  const handleClickClose = () => {
    setOpenUpsertProductDiscountModal(false)
    setSelectedProductDiscount({})
  }

  const handleChange = (e: FormChanged) => {
    const { name, value } = e.target
    setProductDiscountData({ ...productDiscountData, [name]: value })
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)

    if (Object.keys(selectedProductDiscount).length > 0) {
      await updateProductDiscount(productDiscountData, selectedProductDiscount._id!, userState.data.accessToken!)
      setOpenUpsertProductDiscountModal(false)
    } else {
      await createProductDiscount(productDiscountData, userState.data.accessToken!)
      setOpenUpsertProductDiscountModal(false)
      setActiveDiscount(false)
      setProductDiscountData({
        product: '',
        percentage: 0,
        startDate: '',
        endDate: ''
      })
      navigate('/admin/product-discount')
    }

    setLoading(false)
  }

  useEffect(() => {
    const fetchProduct = async() => {
      const res = await getDataAPI(`/product?search=${productKeyword}`)
      setProductData(res.data.product)
    }

    if (productKeyword.length > 3) {
      fetchProduct()
    } else {
      setProductData([])
    }
  }, [productKeyword])

  useEffect(() => {
    if (Object.keys(selectedProductDiscount).length > 0) {
      setProductDiscountData({
        product: selectedProductDiscount.product?._id as string,
        percentage: selectedProductDiscount.percentage as number,
        startDate: selectedProductDiscount.startDate?.split('T')[0] as string,
        endDate: selectedProductDiscount.endDate?.split('T')[0] as string
      })
      // @ts-ignore
      setSelectedProduct(selectedProductDiscount.product)
    } else {
      setProductDiscountData({
        product: '',
        percentage: 0,
        startDate: '',
        endDate: ''
      })
      setSelectedProduct({})
    }
  }, [selectedProductDiscount])
  
  return (
    <div className={`${openUpsertProductDiscountModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={upsertProductDiscountModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openUpsertProductDiscountModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>{Object.keys(selectedProductDiscount).length > 0 ? 'Update' : 'Create'} Product Discount</p>
          <AiOutlineClose onClick={handleClickClose} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='mb-6'>
            <p className='text-sm'>Product</p>
            <div className='mt-4 relative'>
              {
                productDiscountData.product
                ? (
                  <div className={`flex items-center gap-2 border border-gray-300 rounded-md p-3 text-sm justify-between ${Object.keys(selectedProductDiscount).length > 0 ? 'bg-gray-200' : 'bg-white'}`}>
                    <p>{selectedProduct.name}</p>
                    {
                      Object.keys(selectedProductDiscount).length < 1 &&
                      <AiOutlineClose className='cursor-pointer' onClick={handleRemoveProduct} />
                    }
                  </div>
                )
                : (
                  <div className='rounded-md p-3 border border-gray-300 flex items-center gap-3'>
                    <input type='text' value={productKeyword} onChange={e => setProductKeyword(e.target.value)} className='flex-1 outline-none text-sm' />
                    <AiOutlineSearch />
                  </div>
                )
              }

              {
                productKeyword.length > 3 &&
                <>
                  {
                    productData.length === 0
                    ? (
                      <div className='bg-red-500 py-3 w-full rounded-md mt-2'>
                        <p className='text-center text-white font-bold text-sm'>No records found</p>
                      </div>
                    )
                    : (
                      <div className='absolute left-0 top-full bg-white rounded-md mt-2 shadow-lg w-full border border-gray-300'>
                        {
                          productData.map((item, idx) => (
                            <div key={item._id} onClick={() => handleClickProduct(item)} className={`hover:bg-gray-100 transition cursor-ointer w-full p-3 ${idx === 0 && productData.length > 1 ? 'rounded-t-md border-b border-gray-300' : idx === productData.length - 1 && productData.length > 1 ? 'rounded-b-md' : idx === 0 && productData.length === 1 ? 'rounded-md' : ''} cursor-pointer`}>
                              <p className='text-sm'>{item.name}</p>
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                </>
              }
            </div>
          </div>
          <div className='mb-6'>
            <label htmlFor='percentage' className='text-sm'>Percentage</label>
            <input type='number' name='percentage' value={productDiscountData.percentage} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
          </div>
          <div className='flex items-center gap-4 mb-6'>
            <div className='flex-1'>
              <label htmlFor='startDate' className='text-sm'>Start Date</label>
              <input type='date' name='startDate' min={new Date().toISOString().split('T')[0]} value={productDiscountData.startDate} onChange={handleChange} className='w-full outline-none border border-gray-300 p-3 text-sm rounded-md mt-4' />
            </div>
            <div className='flex-1'>
              <label htmlFor='endDate' className='text-sm'>End Date</label>
              <input type='date' name='endDate' min={new Date().toISOString().split('T')[0]} value={productDiscountData.endDate} onChange={handleChange} className='w-full outline-none border border-gray-300 p-3 text-sm rounded-md mt-4' />
            </div>
          </div>
          <div className='flex justify-end'>
            <button disabled={loading} className={`${!loading ? 'bg-black hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed'} bg-black text-white rounded-md text-sm px-6 py-2 transition hover:bg-gray-800`}>
              {
                loading
                ? 'Loading ...'
                : Object.keys(selectedProductDiscount).length > 0 ? 'Save Changes' : 'Save'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpsertProductDiscount