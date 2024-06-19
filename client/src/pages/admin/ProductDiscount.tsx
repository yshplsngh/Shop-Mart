import { useState, useEffect, useRef } from 'react'
import { LuPlus } from "react-icons/lu"
import { useNavigate, useLocation } from 'react-router-dom'
import AdminLayout from "../../components/template/AdminLayout"
import { FaTrashAlt } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import Pagination from '../../components/general/Pagination'
import UpsertProductDiscount from '../../components/modal/ProductDiscountManagement/UpsertProductDiscount'
import useStore from './../../store/store'
import Loader from '../../components/general/Loader'
import { IProductDiscount } from '../../utils/interface'
import Delete from '../../components/modal/Delete'
import { formatDate } from '../../utils/date'

const ProductDiscount = () => {
  const [activeDiscount, setActiveDiscount] = useState(true)
  const [openUpsertProductDiscountModal, setOpenUpsertProductDiscountModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedProductDiscount, setSelectedProductDiscount] = useState<Partial<IProductDiscount>>({})

  const upsertProductDiscountModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const deleteModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const page = Number(searchParams.get('page')) || 1
  const limit = 9

  const { userState, productDiscountState, readProductDiscount, deleteProductDiscount } = useStore()

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        navigate(`/admin/product-discount?page=${page - 1}`)
      } else {
        navigate('/admin/product-discount')
      }
    } else if (type === 'next') {
      if (page === productDiscountState.totalPage) {
        navigate(`/admin/product-discount?page=${productDiscountState.totalPage}`)
      } else {
        navigate(`/admin/product-discount?page=${page + 1}`)
      }
    }
  }

  const handleClickDelete = (item: IProductDiscount) => {
    setSelectedProductDiscount(item)
    setOpenDeleteModal(true)
  }

  const handleDelete = () => {
    if (productDiscountState.data.length === 1 && page !== 1) {
      navigate(`/admin/productDiscount?page=${page - 1}`)
    }
    deleteProductDiscount(selectedProductDiscount._id!, page, userState.data.accessToken!)
    setOpenDeleteModal(false)
    setSelectedProductDiscount({})
  }

  const handleClickEdit = (item: IProductDiscount) => {
    setSelectedProductDiscount(item)
    setOpenUpsertProductDiscountModal(true)
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertProductDiscountModal && upsertProductDiscountModalRef.current && !upsertProductDiscountModalRef.current.contains(e.target as Node)) {
        setOpenUpsertProductDiscountModal(false)
        setSelectedProductDiscount({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openUpsertProductDiscountModal])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setOpenDeleteModal(false)
        setSelectedProductDiscount({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDeleteModal])

  useEffect(() => {
    if (userState.data.accessToken) {
      readProductDiscount(userState.data.accessToken, page, limit, activeDiscount ? '1' : '0')
    }
  }, [readProductDiscount, userState.data.accessToken, page, limit, activeDiscount])

  useEffect(() => {
    if (!userState.loading) {
      if (userState.data.accessToken) {
        if (userState.data.user?.role !== 'admin') {
          navigate('/')
        }
      } else {
        navigate('/login')
      }
    }
  }, [userState.data, userState.loading, navigate])

  return (
    <>
      <AdminLayout title='Product Discount Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Product Discount</h1>
            <div className='flex items-center gap-5'>
              <button onClick={() => setOpenUpsertProductDiscountModal(true)} className='flex items-center gap-3 bg-black text-white rounded-md py-3 px-5 text-sm transition hover:bg-gray-800'>
                <LuPlus />
                <p>Add Product Discount</p>
              </button>
            </div>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold'>List Product Discount</p>
              <div className='flex items-center gap-3'>
                <div onClick={() => setActiveDiscount(!activeDiscount)} className='w-12 h-6 rounded-full bg-white border border-gray-500 relative cursor-pointer'>
                  <div className={`w-4 h-4 rounded-full ${activeDiscount ? 'bg-black right-1' : 'bg-gray-200 right-7'} absolute top-1/2 -translate-y-1/2 transition-all duration-300`} />
                </div>
                <p className='text-sm'>Active</p>
              </div>
            </div>
            {
              productDiscountState.loading
              ? (
                <div className='mt-8 flex justify-center'>
                  <Loader size='xl' />
                </div>
              )
              : (
                <>
                  <div className='overflow-x-auto mt-8'>
                    <table className='w-full text-left'>
                      <thead className='text-sm text-gray-500 font-normal'>
                        <tr>
                          <th className='pb-5'>Product Name</th>
                          <th className='pb-5'>Percentage</th>
                          <th className='pb-5'>Start Date</th>
                          <th className='pb-5'>End Date</th>
                          <th className='pb-5'>Action</th>
                        </tr>
                      </thead>
                      {
                        productDiscountState.data.length === 0
                        ? (
                          <tbody>
                            <tr className='bg-red-500'>
                              <td colSpan={5} className='rounded-md text-center text-white font-bold py-3 text-sm'>No records found</td>
                            </tr>
                          </tbody>
                        )
                        : (
                          <tbody className='text-sm'>
                            {
                              productDiscountState.data.map(item => (
                                <tr key={item._id} className='border-b border-gray-200'>
                                  <td className='py-4'>{item.product.name}</td>
                                  <td>{item.percentage}%</td>
                                  <td>{formatDate(item.startDate)}</td>
                                  <td>{formatDate(item.endDate)}</td>
                                  <td className='flex items-center gap-4 py-4'>
                                    <MdEdit onClick={() => handleClickEdit(item)} className='text-blue-500 text-xl cursor-pointer' />
                                    <FaTrashAlt onClick={() => handleClickDelete(item)} className='text-red-500 text-lg cursor-pointer' />
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        )
                      }
                    </table>
                  </div>
                  {
                    productDiscountState.totalPage > 1 &&
                    <div className='mt-12 flex justify-center'>
                      <Pagination
                        currentPage={page}
                        totalPage={productDiscountState.totalPage}
                        handleChangePage={handleChangePage}
                      />
                    </div>
                  }
                </>
              )
            }
          </div>
        </div>
      </AdminLayout>

      <UpsertProductDiscount
        openUpsertProductDiscountModal={openUpsertProductDiscountModal}
        setOpenUpsertProductDiscountModal={setOpenUpsertProductDiscountModal}
        upsertProductDiscountModalRef={upsertProductDiscountModalRef}
        setActiveDiscount={setActiveDiscount}
        selectedProductDiscount={selectedProductDiscount}
        setSelectedProductDiscount={setSelectedProductDiscount}
      />

      <Delete
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        handleDelete={handleDelete}
        name={selectedProductDiscount.product?.name || '' as string}
        entity='product discount'
        removeSelectedItem={() => setSelectedProductDiscount({})}
      />
    </>
  )
}

export default ProductDiscount