import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuPlus } from "react-icons/lu"
import AdminLayout from "../../components/template/AdminLayout"
import { MdEdit } from "react-icons/md"
import { FaTrashAlt } from "react-icons/fa"
import UpsertOwnerPick from '../../components/modal/OwnerPick/UpsertOwnerPick'
import useStore from './../../store/store'
import Loader from '../../components/general/Loader'
import { IOwnerPick } from '../../utils/interface'
import Delete from '../../components/modal/Delete'

const OwnerPick = () => {
  const [openUpsertOwnerPickModal, setOpenUpsertOwnerPickModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedOwnerPick, setSelectedOwnerPick] = useState<Partial<IOwnerPick>>({})

  const upsertOwnerPickModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const deleteModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const { userState, ownerPickState, readOwnerPick, deleteOwnerPick } = useStore()

  const navigate = useNavigate()

  const handleClickEdit = (item: IOwnerPick) => {
    setSelectedOwnerPick(item)
    setOpenUpsertOwnerPickModal(true)
  }

  const handleClickDelete = (item: IOwnerPick) => {
    setSelectedOwnerPick(item)
    setOpenDeleteModal(true)
  }

  const handleDelete = () => {
    deleteOwnerPick(selectedOwnerPick._id!, userState.data.accessToken!)
    setOpenDeleteModal(false)
    setSelectedOwnerPick({})
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openUpsertOwnerPickModal && upsertOwnerPickModalRef.current && !upsertOwnerPickModalRef.current.contains(e.target as Node)) {
        setOpenUpsertOwnerPickModal(false)
        setSelectedOwnerPick({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openUpsertOwnerPickModal])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openDeleteModal && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setOpenDeleteModal(false)
        setSelectedOwnerPick({})
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openDeleteModal])

  useEffect(() => {
    readOwnerPick()
  }, [readOwnerPick])

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
      <AdminLayout title="Owner's Pick">
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Owner's Pick</h1>
            <div className='flex items-center gap-5'>
              <button onClick={() => setOpenUpsertOwnerPickModal(true)} className='flex items-center gap-3 bg-black text-white rounded-md py-3 px-5 text-sm transition hover:bg-gray-800'>
                <LuPlus />
                <p>Add Owner's Pick</p>
              </button>
            </div>
          </div>

          <div className='rounded-md shadow-xl bg-white mt-10 overflow-auto py-6 px-8 hide-scrollbar'>
            <p className='font-semibold'>List Owner's Pick</p>
            {
              ownerPickState.loading
              ? (
                <div className='mt-8 flex justify-center'>
                  <Loader size='xl' />
                </div>
              )
              : (
                <div className='overflow-x-auto mt-8'>
                  <table className='w-full text-left'>
                    <thead className='text-sm text-gray-500 font-normal'>
                      <tr>
                        <th className='pb-5'>Product Name</th>
                        <th className='pb-5'>Action</th>
                      </tr>
                    </thead>
                    {
                      ownerPickState.data.length === 0
                      ? (
                        <tbody>
                          <tr className='bg-red-500'>
                            <td colSpan={2} className='rounded-md text-center text-white font-bold py-3 text-sm'>No records found</td>
                          </tr>
                        </tbody>
                      )
                      : (
                        <tbody className='text-sm'>
                          {
                            ownerPickState.data.map(item => (
                              <tr key={item._id} className='border-b border-gray-200'>
                                <td className='py-4'>{item.product.name}</td>
                                <td className='flex items-center gap-5 py-4'>
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
              )
            }
          </div>  
        </div>
      </AdminLayout>

      <UpsertOwnerPick
        openUpsertOwnerPickModal={openUpsertOwnerPickModal}
        setOpenUpsertOwnerPickModal={setOpenUpsertOwnerPickModal}
        upsertOwnerPickModalRef={upsertOwnerPickModalRef}
        selectedOwnerPick={selectedOwnerPick}
        setSelectedOwnerPick={setSelectedOwnerPick}
      />

      <Delete
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        handleDelete={handleDelete}
        name={selectedOwnerPick.product?.name || '' as string}
        entity="from owner's pick section"
        removeSelectedItem={() => setSelectedOwnerPick({})}
      />
    </>
  )
}

export default OwnerPick