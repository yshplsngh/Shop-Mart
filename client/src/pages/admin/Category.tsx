import { useState, useEffect, useRef } from 'react'
import { LuPlus } from 'react-icons/lu'
import { VscTextSize } from 'react-icons/vsc'
import { AiOutlineSearch } from 'react-icons/ai'
import AdminLayout from './../../components/template/AdminLayout'
import { MdEdit } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'
import Pagination from '../../components/general/Pagination'
import UpsertCategory from '../../components/modal/CategoryManagement/UpsertCategory'
import SetDefaultSize from '../../components/modal/CategoryManagement/SetDefaultSize'
import Delete from '../../components/modal/Delete'

const Category = () => {
  const [openUpsertCategoryModal, setOpenUpsertCategoryModal] = useState(false)
  const [openSetDefaultSizeModal, setOpenSetDefaultSizeModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [keyword, setKeyword] = useState('')
  
  const upsertCategoryModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const setDefaultSizeModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const deleteModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertCategoryModal && upsertCategoryModalRef.current && !upsertCategoryModalRef.current.contains(e.target as Node)) {
        setOpenUpsertCategoryModal(false)
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
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDeleteModal])
  
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
            <div className='overflow-x-auto mt-8'>
              <table className='w-full text-left'>
                <thead className='text-sm text-gray-500 font-normal'>
                  <tr>
                    <th className='pb-5'>Category Name</th>
                    <th className='pb-5'>Created At</th>
                    <th className='pb-5'>Action</th>
                  </tr>
                </thead>
                <tbody className='text-sm'>
                  <tr className='border-b border-gray-200'>
                    <td className='py-4'>Shirt</td>
                    <td>12 January 2024</td>
                    <td className='flex items-center gap-5 py-4'>
                      <MdEdit className='text-blue-500 text-xl cursor-pointer' />
                      <FaTrashAlt onClick={() => setOpenDeleteModal(true)} className='text-red-500 text-lg cursor-pointer' />
                      <VscTextSize onClick={() => setOpenSetDefaultSizeModal(true)} className='text-xl text-orange-500 cursor-pointer' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='mt-12 flex justify-center'>
              <Pagination />
            </div>
          </div>
        </div>
      </AdminLayout>

      <UpsertCategory
        openUpsertCategoryModal={openUpsertCategoryModal}
        setOpenUpsertCategoryModal={setOpenUpsertCategoryModal}
        upsertCategoryModalRef={upsertCategoryModalRef}
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
      />
    </>
  )
}

export default Category