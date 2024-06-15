import { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormChanged, FormSubmitted } from '../../../utils/interface'
import useStore from './../../../store/store'

interface IProps {
  openUpsertCategoryModal: boolean
  setOpenUpsertCategoryModal: React.Dispatch<React.SetStateAction<boolean>>
  upsertCategoryModalRef: React.MutableRefObject<HTMLDivElement>
}

const UpsertCategory: React.FC<IProps> = ({ openUpsertCategoryModal, setOpenUpsertCategoryModal, upsertCategoryModalRef }) => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    availableSize: [''],
    sizeParameter: ['']
  })
  const [loading, setLoading] = useState(false)

  const { createCategory, userState } = useStore()

  const handleChange = (e: FormChanged) => {
    const { name, value } = e.target
    setCategoryData({ ...categoryData, [name]: value })
  }

  const handleAddNewAvailableSize = () => {
    setCategoryData({ ...categoryData, availableSize: [...categoryData.availableSize, ''] })
  }

  const handleRemoveAvailableSize = (idx: number) => {
    const newAvailableSize = [...categoryData.availableSize]
    newAvailableSize.splice(idx, 1)
    setCategoryData({ ...categoryData, availableSize: newAvailableSize })
  }

  const handleChangeAvailableSize = (e: FormChanged, idx: number) => {
    const newAvailableSize = [...categoryData.availableSize]
    newAvailableSize[idx] = e.target.value
    setCategoryData({ ...categoryData, availableSize: newAvailableSize })
  }

  const handleAddNewSizeParameter = () => {
    setCategoryData({ ...categoryData, sizeParameter: [...categoryData.sizeParameter, ''] })
  }

  const handleRemoveSizeParameter = (idx: number) => {
    const newSizeParameter = [...categoryData.sizeParameter]
    newSizeParameter.splice(idx, 1)
    setCategoryData({ ...categoryData, sizeParameter: newSizeParameter })
  }

  const handleChangeSizeParameter = (e: FormChanged, idx: number) => {
    const newSizeParameter = [...categoryData.sizeParameter]
    newSizeParameter[idx] = e.target.value
    setCategoryData({ ...categoryData, sizeParameter: newSizeParameter })
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)
    await createCategory({
      name: categoryData.name,
      availableSizes: categoryData.availableSize,
      availableSizeParameters: categoryData.sizeParameter
    }, userState.data.accessToken!)
    setOpenUpsertCategoryModal(false)
    setCategoryData({
      name: '',
      availableSize: [''],
      sizeParameter: ['']
    })
    setLoading(false)
  }

  return (
    <div className={`${openUpsertCategoryModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={upsertCategoryModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openUpsertCategoryModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Create Product Category</p>
          <AiOutlineClose onClick={() => setOpenUpsertCategoryModal(false)} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='mb-6'>
            <label htmlFor='name' className='text-sm'>Category Name</label>
            <input type='text' id='name' name='name' value={categoryData.name} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
          </div>
          <div className='mb-6'>
            <p className='text-sm'>Available Size</p>
            <div className='grid grid-cols-3 gap-4 items-center mt-4'>
              {
                categoryData.availableSize.map((item, idx) => (
                  <div key={idx} className='w-full border border-gray-300 rounded-md p-3 flex items-center justify-between'>
                    <input type='text' value={item} onChange={e => handleChangeAvailableSize(e, idx)} className='outline-none text-sm flex-1 pr-2' />
                    <AiOutlineClose onClick={() => handleRemoveAvailableSize(idx)} className='cursor-pointer text-sm' />
                  </div>
                ))
              }
              <p onClick={handleAddNewAvailableSize} className='text-blue-500 text-sm w-fit cursor-pointer'>New</p>
            </div>
          </div>
          <div className='mb-6'>
            <p className='text-sm'>Size Parameter</p>
            <div className='grid grid-cols-3 gap-4 items-center mt-4'>
              {
                categoryData.sizeParameter.map((item, idx) => (
                  <div key={idx} className='w-full border border-gray-300 rounded-md p-3 flex items-center justify-between'>
                    <input type='text' value={item} onChange={e => handleChangeSizeParameter(e, idx)} className='outline-none text-sm flex-1 pr-2' />
                    <AiOutlineClose onClick={() => handleRemoveSizeParameter(idx)} className='cursor-pointer text-sm' />
                  </div>
                ))
              }
              <p onClick={handleAddNewSizeParameter} className='text-blue-500 text-sm w-fit cursor-pointer'>New</p>
            </div>
          </div>
          <div className='flex justify-end'>
            <button disabled={loading || !categoryData.name || categoryData.availableSize.length < 1 || categoryData.sizeParameter.length < 1 || categoryData.availableSize.includes('') || categoryData.sizeParameter.includes('')} className={`${loading || !categoryData.name || categoryData.availableSize.length < 1 || categoryData.sizeParameter.length < 1 || categoryData.availableSize.includes('') || categoryData.sizeParameter.includes('') ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} text-white text-sm px-6 py-2 rounded-md transition`}>
              {
                loading
                ? 'Loading ...'
                : 'Save'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpsertCategory