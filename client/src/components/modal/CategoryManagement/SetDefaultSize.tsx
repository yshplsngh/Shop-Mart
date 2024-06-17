import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FormChanged, FormSubmitted, ICategory } from './../../../utils/interface'
import useStore from './../../../store/store'

interface IProps {
  openSetDefaultSizeModal: boolean
  setOpenSetDefaultSizeModal: React.Dispatch<React.SetStateAction<boolean>>
  setDefaultSizeModalRef: React.MutableRefObject<HTMLDivElement>
  selectedCategory: Partial<ICategory>
  setSelectedCategory: React.Dispatch<React.SetStateAction<Partial<ICategory>>>
}

const SetDefaultSize: React.FC<IProps> = ({ openSetDefaultSizeModal, setOpenSetDefaultSizeModal, setDefaultSizeModalRef, selectedCategory, setSelectedCategory }) => {
  const [loading, setLoading] = useState(false)
  const [sizeChart, setSizeChart] = useState<object[]>([])

  const { userState, updateCategorySizeChart } = useStore()

  const handleCloseModal = () => {
    setOpenSetDefaultSizeModal(false)
    setSelectedCategory({})
  }

  const handleChange = (e: FormChanged, idx: number) => {
    const { name, value } = e.target
    const sizeChartCopy = [...sizeChart]
    sizeChartCopy[idx] = { ...sizeChartCopy[idx], [name]: value }
    setSizeChart(sizeChartCopy)
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)
    await updateCategorySizeChart({ sizeChart }, selectedCategory._id!, userState.data.accessToken!)
    setOpenSetDefaultSizeModal(false)
    setLoading(false)
  }

  useEffect(() => {
    const injectDefaultSize = () => {
      const sizes = selectedCategory.availableSizes!
      const injectedDefaultSize = []
      for (const size of sizes) {
        const stateObj = { size }
        for (const param of selectedCategory.availableSizeParameters!) {
          // @ts-ignore
          stateObj[param] = ''
        }
        injectedDefaultSize.push(stateObj)
      }
      setSizeChart(injectedDefaultSize)
    }

    if (Object.keys(selectedCategory).length > 0) {
      if (Object.keys(selectedCategory.sizeChart!).length > 0) {
        setSizeChart(selectedCategory.sizeChart!)
      } else {
        injectDefaultSize()
      }
    } else {
      setSizeChart([])
    }
  }, [selectedCategory])

  return (
    <div className={`${openSetDefaultSizeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={setDefaultSizeModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openSetDefaultSizeModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Set {selectedCategory.name} Default Size</p>
          <AiOutlineClose onClick={handleCloseModal} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          {
            sizeChart.map((item, arrIdx) => (
              <div key={arrIdx} className='border border-gray-300 rounded-md mb-6'>
                <div className='px-5 py-2 border-b border-gray-300'>
                  {/* @ts-ignore */}
                  <p>Size: {item.size}</p>
                </div>
                <div className='px-5 py-3'>
                  {
                    Object.keys(item).map((key, keyIdx) => (
                      key !== 'size' &&
                      <div key={keyIdx} className='mb-6'>
                        <p className='text-sm'>{key}</p>
                        {/* @ts-ignore */}
                        <input type='text' name={key} value={sizeChart[arrIdx][key]} onChange={e => handleChange(e, arrIdx)} className='w-full outline-none border border-gray-300 px-2 py-3 text-sm rounded-md mt-4' />
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
          <div className='flex justify-end'>
            <button disabled={loading} className={`${loading ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} text-white text-sm px-5 py-3 rounded-md transition`}>
              {
                loading
                ? 'Loading ...'
                : 'Save Changes'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SetDefaultSize