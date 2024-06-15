import { useState, useEffect, useRef } from 'react'
import { LuPlus } from 'react-icons/lu'
import { VscTextSize } from 'react-icons/vsc'
import { AiOutlineSearch } from 'react-icons/ai'
import { useNavigate, useLocation } from 'react-router-dom'
import AdminLayout from './../../components/template/AdminLayout'
import { MdEdit } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'
import Pagination from '../../components/general/Pagination'
import UpsertCategory from '../../components/modal/CategoryManagement/UpsertCategory'
import SetDefaultSize from '../../components/modal/CategoryManagement/SetDefaultSize'
import Delete from '../../components/modal/Delete'
import useStore from './../../store/store'
import { formatDate } from '../../utils/date'
import Loader from '../../components/general/Loader'
import { ICategory } from '../../utils/interface'

const Category = () => {
  const [openUpsertCategoryModal, setOpenUpsertCategoryModal] = useState(false)
  const [openSetDefaultSizeModal, setOpenSetDefaultSizeModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Partial<ICategory>>({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [keyword, setKeyword] = useState('')
  
  const upsertCategoryModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const setDefaultSizeModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const deleteModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const page = Number(searchParams.get('page')) || 1
  const limit = 9

  const { userState, categoryState, readCategory, deleteCategory } = useStore()

  const handleChangePage = (type: string) => {
    if (type === 'previous') {
      if (page > 1) {
        navigate(`/admin/category?page=${page - 1}`)
      } else {
        navigate('/admin/category')
      }
    } else if (type === 'next') {
      if (page === categoryState.totalPage) {
        navigate(`/admin/category?page=${categoryState.totalPage}`)
      } else {
        navigate(`/admin/category?page=${page + 1}`)
      }
    }
  }

  const handleClickEdit = (item: ICategory) => {
    setSelectedCategory(item)
    setOpenUpsertCategoryModal(true)
  }

  const handleClickDelete = (item: ICategory) => {
    setSelectedCategory(item)
    setOpenDeleteModal(true)
  }

  const handleDelete = () => {
    if (categoryState.data.length === 1 && page !== 1) {
      navigate(`/admin/category?page=${page - 1}`)
    }
    deleteCategory(selectedCategory._id!, page, userState.data.accessToken!)
    setOpenDeleteModal(false)
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertCategoryModal && upsertCategoryModalRef.current && !upsertCategoryModalRef.current.contains(e.target as Node)) {
        setOpenUpsertCategoryModal(false)
        setSelectedCategory({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openUpsertCategoryModal])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if  (openSetDefaultSizeModal && setDefaultSizeModalRef.current && !setDefaultSizeModalRef.current.contains(e.target as Node)) {
        setOpenSetDefaultSizeModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openSetDefaultSizeModal])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setOpenDeleteModal(false)
        setSelectedCategory({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDeleteModal])
  
  useEffect(() => {
    if (userState.data.accessToken)
      readCategory(userState.data.accessToken, page, limit)
  }, [userState.data.accessToken, page, limit, readCategory])

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
      <AdminLayout title='Category Management'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Product Category</h1>
            <div className='flex items-center gap-5'>
              <div className='relative bg-white py-3 rounded-md shadow-xl px-3 w-[300px]'>
                <input type='text' name='keyword' id='keyword' value={keyword} onChange={e => setKeyword(e.target.value)} className='outline-none bg-white' />
                <div className={`${keyword ? 'hidden' : 'flex'} items-center gap-3 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 text-sm pointer-events-none`}>
                  <AiOutlineSearch />
                  <p>Search</p>
                </div>
              </div>
              <button onClick={() => setOpenUpsertCategoryModal(true)} className='flex items-center gap-3 bg-black text-white rounded-md py-3 px-5 text-sm transition hover:bg-gray-800'>
                <LuPlus />
                <p>Add Category</p>
              </button>
            </div>
          </div>

          {/* content */}
          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <p className='font-semibold'>List Product Category</p>
            {
              categoryState.loading
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
                          <th className='pb-5'>Category Name</th>
                          <th className='pb-5'>Created At</th>
                          <th className='pb-5'>Action</th>
                        </tr>
                      </thead>
                      {
                        categoryState.data.length === 0
                        ? (
                          <tr className='bg-red-500'>
                            <td colSpan={3} className='rounded-md text-center text-white font-bold py-3 text-sm'>No records found</td>
                          </tr>
                        )
                        : (
                          <tbody className='text-sm'>
                            {
                              categoryState.data.map(item => (
                                <tr key={item._id} className='border-b border-gray-200'>
                                  <td className='py-4'>{item.name}</td>
                                  <td>{formatDate(item.createdAt)}</td>
                                  <td className='flex items-center gap-5 py-4'>
                                    <MdEdit onClick={() => handleClickEdit(item)} className='text-blue-500 text-xl cursor-pointer' />
                                    <FaTrashAlt onClick={() => handleClickDelete(item)} className='text-red-500 text-lg cursor-pointer' />
                                    <VscTextSize onClick={() => setOpenSetDefaultSizeModal(true)} className='text-xl text-orange-500 cursor-pointer' />
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
                    categoryState.totalPage > 1 &&
                    <div className='mt-12 flex justify-center'>
                      <Pagination
                        currentPage={page}
                        totalPage={categoryState.totalPage}
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

      <UpsertCategory
        openUpsertCategoryModal={openUpsertCategoryModal}
        setOpenUpsertCategoryModal={setOpenUpsertCategoryModal}
        upsertCategoryModalRef={upsertCategoryModalRef}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <SetDefaultSize
        openSetDefaultSizeModal={openSetDefaultSizeModal}
        setOpenSetDefaultSizeModal={setOpenSetDefaultSizeModal}
        setDefaultSizeModalRef={setDefaultSizeModalRef}
      />

      <Delete
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        handleDelete={handleDelete}
        name={selectedCategory.name || '' as string}
        entity='category'
        removeSelectedItem={() => setSelectedCategory({})}
      />
    </>
  )
}

export default Category