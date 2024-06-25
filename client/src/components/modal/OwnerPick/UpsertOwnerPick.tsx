import { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai"
import { FormSubmitted, IOwnerPick, IProduct } from "../../../utils/interface"
import { currencyFormatter } from "../../../utils/currency"
import { getDataAPI } from '../../../utils/fetchData'
import { APP_NAME } from '../../../utils/constant'
import useStore from './../../../store/store'

interface IProps {
  openUpsertOwnerPickModal: boolean
  setOpenUpsertOwnerPickModal: React.Dispatch<React.SetStateAction<boolean>>
  upsertOwnerPickModalRef: React.MutableRefObject<HTMLDivElement>
  selectedOwnerPick: Partial<IOwnerPick>
  setSelectedOwnerPick: React.Dispatch<React.SetStateAction<Partial<IOwnerPick>>>
}

const UpsertOwnerPick: React.FC<IProps> = ({ openUpsertOwnerPickModal, setOpenUpsertOwnerPickModal, upsertOwnerPickModalRef, selectedOwnerPick, setSelectedOwnerPick }) => {
  const [keyword, setKeyword] = useState('')
  const [products, setProducts] = useState<IProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Partial<IProduct>>({})
  const [loading, setLoading] = useState(false)

  const { userState, createOwnerPick, updateOwnerPick } = useStore()
    
  const handleClickClose = () => {
    setOpenUpsertOwnerPickModal(false)
    setSelectedOwnerPick({})
  }

  const handleSelectProduct = (item: IProduct) => {
    setSelectedProduct(item)
    setProducts([])
    setKeyword('')
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)

    if (Object.keys(selectedOwnerPick).length > 0) {
      await updateOwnerPick({ product: selectedProduct._id }, selectedOwnerPick._id!, userState.data.accessToken!)
      setSelectedOwnerPick({})
    } else {
      await createOwnerPick({ product: selectedProduct._id }, userState.data.accessToken!)
    }
    
    setOpenUpsertOwnerPickModal(false)
    setSelectedProduct({})

    setLoading(false)
  }

  useEffect(() => {
    const fetchProducts = async(keyword: string) => {
      try {
        const res = await getDataAPI(`/product?search=${keyword}`)
        setProducts(res.data.product)
      } catch (err: any) {}
    }

    if (keyword.length > 3)
      fetchProducts(keyword)
    else
      setProducts([])
  }, [keyword])

  useEffect(() => {
    if (Object.keys(selectedOwnerPick).length > 0) {
      setSelectedProduct(selectedOwnerPick.product!)
    } else {
      setSelectedProduct({})
    }
  }, [selectedOwnerPick])

  return (
    <div className={`${openUpsertOwnerPickModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={upsertOwnerPickModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openUpsertOwnerPickModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>{Object.keys(selectedOwnerPick).length > 0 ? 'Update' : 'Select'} owner's pick</p>
          <AiOutlineClose onClick={handleClickClose} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div>
            <div>
              <label htmlFor='product' className='text-sm'>Product</label>
              <div className='mt-3 flex items-center gap-4 border border-gray-300 rounded-m p-3 rounded-md text-sm'>
                {
                  Object.keys(selectedProduct).length > 0
                  ? <p className='flex-1'>{selectedProduct.name}</p>
                  : <input type='text' value={keyword} onChange={e => setKeyword(e.target.value)} className='outline-none flex-1' />
                }

                {
                  Object.keys(selectedProduct).length > 0
                  ? <AiOutlineClose onClick={() => setSelectedProduct({})} className='text-xl cursor-pointer' />
                  : <AiOutlineSearch className='text-xl' />
                }
              </div>
            </div>
            {
              keyword.length > 3
              ? (
                products.length > 0
                ? (
                  <div className='mt-5 bg-white rounded-md border border-gray-300'>
                    {
                      products.map((item, idx) => (
                        <div onClick={() => handleSelectProduct(item)} key={item._id} className={`cursor-pointer hover:bg-gray-200 ${products.length === 1 ? 'rounded-md' : idx === 0 ? 'border-b border-gray-300 rounded-t-md' : idx === products.length - 1 ? 'rounded-b-md' : ''} transition flex items-center gap-5 p-4`}>
                          <div className='w-20 h-20 rounded-md bg-gray-200'>
                            <img src={item.images[0]} alt={`${APP_NAME} - ${item.name}`} className='w-full h-full object-cover rounded-md border border-gray-300' />
                          </div>
                          <div>
                            <h1 className='font-semibold'>{item.name}</h1>
                            <p className='text-gray-500 text-sm mt-2'>{item.shortDescription}</p>
                            <p className='mt-2 font-semibold'>{currencyFormatter(item.price)},00</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
                : (
                  <div className='bg-red-500 text-white text-sm text-center py-3 font-semibold rounded-md mt-5'>
                    <p>No records found</p>
                  </div>
                )
              )
              : <div></div>
            }
          </div>
          <div className='flex justify-end mt-6'>
            <button disabled={loading} className={`${loading ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} text-white text-sm px-6 py-2 rounded-md transition`}>
              {
                loading
                ? 'Loading ...'
                : Object.keys(selectedOwnerPick).length > 0 ? 'Save Changes' : 'Save'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpsertOwnerPick