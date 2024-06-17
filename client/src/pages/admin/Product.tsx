import { useState, useEffect, useRef } from 'react'
import { AiOutlineSearch } from "react-icons/ai"
import { useNavigate, useLocation } from 'react-router-dom'
import AdminLayout from "../../components/template/AdminLayout"
import { LuPlus } from "react-icons/lu"
import UpsertProduct from '../../components/modal/ProductManagement/UpsertProduct'
import { FaTrashAlt } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import Pagination from '../../components/general/Pagination'
import useStore from './../../store/store'
import Loader from '../../components/general/Loader'
import { currencyFormatter } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { IProduct } from '../../utils/interface'
import Delete from '../../components/modal/Delete'

const Product = () => {
  const [openUpsertProductModal, setOpenUpsertProductModal] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Partial<IProduct>>({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const upsertProductModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const deleteModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const page = Number(searchParams.get('page')) || 1
  const limit = 9

  const { userState, productState, readProduct, deleteProduct } = useStore()

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        navigate(`/admin/product?page=${page - 1}`)
      } else {
        navigate('/admin/product')
      }
    } else if (type === 'next') {
      if (page === productState.totalPage) {
        navigate(`/admin/product?page=${productState.totalPage}`)
      } else {
        navigate(`/admin/product?page=${page + 1}`)
      }
    }
  }

  const handleClickDelete = (item: IProduct) => {
    setSelectedProduct(item)
    setOpenDeleteModal(true)
  }

  const handleDelete = () => {
    if (productState.data.length === 1 && page !== 1) {
      navigate(`/admin/product?page=${page - 1}`)
    }
    deleteProduct(selectedProduct._id!, page, userState.data.accessToken!)
    setOpenDeleteModal(false)
    setSelectedProduct({})
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertProductModal && upsertProductModalRef.current && !upsertProductModalRef.current.contains(e.target as Node)) {
        setOpenUpsertProductModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openUpsertProductModal])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setOpenDeleteModal(false)
        setSelectedProduct({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDeleteModal])

  useEffect(() => {
    if (keyword) {
      readProduct(1, limit, keyword)
    } else {
      readProduct(page, limit, keyword)
    }
  }, [page, limit, keyword, readProduct])

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
      <AdminLayout title='Product Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Product</h1>
            <div className='flex items-center gap-5'>
              <div className='relative bg-white py-3 rounded-md shadow-xl px-3 w-[300px]'>
                <input type='text' name='keyword' id='keyword' value={keyword} onChange={e => setKeyword(e.target.value)} className='outline-none bg-white' />
                <div className={`${keyword ? 'hidden' : 'flex'} items-center gap-3 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 text-sm pointer-events-none`}>
                  <AiOutlineSearch />
                  <p>Search</p>
                </div>
              </div>
              <button onClick={() => setOpenUpsertProductModal(true)} className='flex items-center gap-3 bg-black text-white rounded-md py-3 px-5 text-sm transition hover:bg-gray-800'>
                <LuPlus />
                <p>Add Product</p>
              </button>
            </div>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <p className='font-semibold'>List Product</p>
            {
              productState.loading
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
                          <th className='pb-5'>Price</th>
                          <th className='pb-5'>Category</th>
                          <th className='pb-5'>Created At</th>
                          <th className='pb-5'>Action</th>
                        </tr>
                      </thead>
                      {
                        productState.data.length === 0
                        ? (
                          <tr className='bg-red-500'>
                            <td colSpan={5} className='rounded-md text-center text-white font-bold py-3 text-sm'>No records found</td>
                          </tr>
                        )
                        : (
                          <tbody className='text-sm'>
                            {
                              productState.data.map(item => (
                                <tr key={item._id} className='border-b border-gray-200'>
                                  <td className='py-4'>{item.name}</td>
                                  <td>{currencyFormatter(item.price)},00</td>
                                  {/* @ts-ignore */}
                                  <td>{item.category.name}</td>
                                  <td>{formatDate(item.createdAt)}</td>
                                  <td className='flex items-center gap-4 py-4'>
                                    <MdEdit className='text-blue-500 text-xl cursor-pointer' />
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
                    productState.totalPage > 1 &&
                    <div className='mt-12 flex justify-center'>
                      <Pagination
                        currentPage={page}
                        totalPage={productState.totalPage}
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

      <UpsertProduct
        openUpsertProductModal={openUpsertProductModal}
        setOpenUpsertProductModal={setOpenUpsertProductModal}
        upsertProductModalRef={upsertProductModalRef}
      />

      <Delete
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        handleDelete={handleDelete}
        name={selectedProduct.name || '' as string}
        entity='product'
        removeSelectedItem={() => setSelectedProduct({})}
      />
    </>
  )
}

export default Product