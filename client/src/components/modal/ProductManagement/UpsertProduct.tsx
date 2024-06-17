import { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { FormChanged, FormSubmitted, ICategory, IProductColor } from '../../../utils/interface'
import { APP_NAME } from '../../../utils/constant'
import useStore from './../../../store/store'
import { getDataAPI } from '../../../utils/fetchData'

interface IProps {
  openUpsertProductModal: boolean
  setOpenUpsertProductModal: React.Dispatch<React.SetStateAction<boolean>>
  upsertProductModalRef: React.MutableRefObject<HTMLDivElement>
}

const UpsertProduct: React.FC<IProps> = ({ openUpsertProductModal, setOpenUpsertProductModal, upsertProductModalRef }) => {
  const [categoryData, setCategoryData] = useState<ICategory[]>([])
  const [categoryKeyword, setCategoryKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Partial<ICategory>>({})

  const [loading, setLoading] = useState(false)

  const [productData, setProductData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    price: 0,
    weight: 0,
    width: 0,
    length: 0,
    height: 0,
    category: ''
  })

  const [sizeChart, setSizeChart] = useState<object[]>([])

  const [colors, setColors] = useState<IProductColor[]>([])

  const [images, setImages] = useState<any[]>([])

  const { userState, createProduct } = useStore()

  const handleChange = (e: FormChanged) => {
    const { name, value } = e.target
    setProductData({ ...productData, [name]: value })
  }

  const handleClickCategory = (item: ICategory) => {
    setSelectedCategory(item)
    setProductData({ ...productData, category: item._id })
    setCategoryKeyword('')
  }

  const handleRemoveCategory = () => {
    setSelectedCategory({})
    setProductData({ ...productData, category: '' })
  }

  const handleChangeImage = (e: FormChanged) => {
    const target = e.target as HTMLInputElement
    const files = [...Object.values(target.files!)]
    setImages([...images, ...files])
  }

  const handleChangeSizeChart = (e: FormChanged, idx: number) => {
    const { name, value } = e.target
    const sizeChartCopy = [...sizeChart]
    sizeChartCopy[idx] = { ...sizeChartCopy[idx], [name]: value }
    setSizeChart(sizeChartCopy)
  }

  const handleRemoveImage = (idx: number) => {
    const newImage = [...images]
    newImage.splice(idx, 1)
    setImages(newImage)
  }

  const handleSetColor = (e: FormChanged, idx: number, key: string) => {
    const { value } = e.target
    const tempColors = [...colors]
    
    if (key === 'hexCode') {
      tempColors[idx]['hexCode'] = value
    } else if (key === 'colorName') {
      tempColors[idx]['colorName'] = value
    }

    setColors(tempColors)
  }

  const handleChangeStock = (e: FormChanged, sizeIdx: number, colorIdx: number) => {
    const tempColors = [...colors]
    tempColors[colorIdx].sizes[sizeIdx].stock = Number(e.target.value)
    setColors(tempColors)
  }

  const handleAddColor = () => {
    const tempColors = [...colors]

    let newObj = {
      hexCode: '',
      colorName: '',
      sizes: []
    }

    const newSize = []
    for (const size of tempColors[0].sizes) {
      newSize.push({ size: size.size, stock: 0 })
    }

    // @ts-ignore
    newObj.sizes = newSize

    setColors([ ...colors, newObj ])
  }

  const handleRemoveColor = (idx: number) => {
    const tempColors = [...colors]
    tempColors.splice(idx, 1)
    setColors(tempColors)
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)

    await createProduct({
      ...productData,
      sizeChart,
      colors,
      images
    }, userState.data.accessToken!)

    setOpenUpsertProductModal(false)

    setLoading(false)
  }

  useEffect(() => {
    const fetchCategory = async() => {
      const res = await getDataAPI(`/category?search=${categoryKeyword}`, userState.data.accessToken)
      setCategoryData(res.data.category)
    }

    if (categoryKeyword.length > 3) {
      fetchCategory()
    } else {
      setCategoryData([])
    }
  }, [categoryKeyword, userState.data.accessToken])

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

    const injectStockTemplate = () => {
      const sizes = selectedCategory.availableSizes!
      const injectedStockTemplate = []

      for (const size of sizes) {
        const stateObj = { size, stock: 0 }
        injectedStockTemplate.push(stateObj)
      }
      
      setColors([
        {
          hexCode: '',
          colorName: '',
          sizes: injectedStockTemplate
        }
      ])
    }

    if (Object.keys(selectedCategory).length > 0) {
      if (Object.keys(selectedCategory.sizeChart!).length > 0) {
        setSizeChart(selectedCategory.sizeChart!)
      } else {
        injectDefaultSize()
      }
      injectStockTemplate()
    } else {
      setSizeChart([])
      setColors([])
    }
  }, [selectedCategory])

  return (
    <div className={`${openUpsertProductModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={upsertProductModalRef} className={`w-1/2 flex flex-col max-h-[90%] bg-white rounded-lg ${openUpsertProductModal ? 'translate-y-0' : '-translate-y-10'} transition-transform`}>
        <div className='flex items-center justify-between px-6 py-3 border-b border-gray-300 bg-gray-900 text-white rounded-t-lg'>
          <p className='font-semibold'>Create Product</p>
          <AiOutlineClose onClick={() => setOpenUpsertProductModal(false)} className='cursor-pointer' />
        </div>
        <form onSubmit={handleSubmit} className='px-6 py-5 hide-scrollbar overflow-auto flex-1'>
          <div className='mb-6'>
            <label htmlFor='name' className='text-sm'>Product Name</label>
            <input type='text' id='name' name='name' value={productData.name} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
          </div>
          <div className='mb-6'>
            <label htmlFor='shortDescription' className='text-sm'>Product Short Description</label>
            <input type='text' id='shortDescription' name='shortDescription' value={productData.shortDescription} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
          </div>
          <div className='mb-6'>
            <label htmlFor='longDescription' className='text-sm'>Product Long Description</label>
            <textarea id='longDescription' name='longDescription' value={productData.longDescription} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm resize-none' />
          </div>
          <div className='mb-6'>
            <label htmlFor='price' className='text-sm'>Product Price</label>
            <input type='number' id='price' name='price' value={productData.price} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
          </div>
          <div className='mb-6 flex items-center gap-3'>
            <div className='flex-1'>
              <label htmlFor='weight' className='text-sm'>Product Weight</label>
              <input type='number' id='weight' name='weight' value={productData.weight} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
            </div>
            <div className='flex-1'>
              <label htmlFor='width' className='text-sm'>Product Width</label>
              <input type='number' id='width' name='width' value={productData.width} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
            </div>
          </div>
          <div className='mb-6 flex items-center gap-3'>
            <div className='flex-1'>
              <label htmlFor='length' className='text-sm'>Product Length</label>
              <input type='number' id='length' name='length' value={productData.length} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
            </div>
            <div className='flex-1'>
              <label htmlFor='height' className='text-sm'>Product Height</label>
              <input type='number' id='height' name='height' value={productData.height} onChange={handleChange} className='w-full outline-none border border-gray-300 rounded-md mt-4 p-3 text-sm' />
            </div>
          </div>
          <div className='mb-6'>
            <p className='text-sm'>Product Category</p>
            <div className='mt-4 relative'>
              {
                productData.category
                ? (
                  <div className='flex items-center gap-2 border border-gray-300 rounded-md p-3 text-sm justify-between'>
                    <p>{selectedCategory.name}</p>
                    <AiOutlineClose className='cursor-pointer' onClick={handleRemoveCategory} />
                  </div>
                )
                : (
                  <div className='flex items-center gap-2 border border-gray-300 rounded-md p-3 text-sm'>
                    <input type='text' id='category' name='category' value={categoryKeyword} onChange={e => setCategoryKeyword(e.target.value)} className='outline-none flex-1' />
                    <AiOutlineSearch />
                  </div>
                )
              }
              
              {
                categoryKeyword.length > 3 &&
                <>
                  {
                    categoryData.length === 0
                    ? (
                      <div className='bg-red-500 py-3 w-full rounded-md mt-2'>
                        <p className='text-center text-white font-bold text-sm'>No records found</p>
                      </div>
                    )
                    : (
                      <div className='absolute left-0 top-full bg-whte rounded-md mt-2 shadow-lg w-full border border-gray-300 bg-white'>
                        {
                          categoryData.map((item, idx) => (
                            <div key={item._id} onClick={() => handleClickCategory(item)} className={`hover:bg-gray-100 transition cursor-pointer w-full p-3 ${idx === 0 && categoryData.length > 1 ? 'rounded-t-md border-b border-gray-300' : idx === categoryData.length - 1 && categoryData.length > 1 ? 'rounded-b-md' : idx === 0 && categoryData.length === 1 ? 'rounded-md' : ''}`}>
                              <p>{item.name}</p>
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
            
          {
            productData.category &&
            <>
              <div className='mb-6'>
                <p className='text-sm'>Product Color</p>
                {/* color #n */}
                {
                  colors.map((item, colorIdx) => (
                    <div key={colorIdx} className='rounded-md border border-gray-300 mt-4'>
                      <div className='p-3 border-b border-gray-300 flex items-center justify-between'>
                        <p className='text-sm font-semibold'>Color #{item.hexCode}</p>
                        {
                          colorIdx !== 0 &&
                          <AiOutlineClose onClick={() => handleRemoveColor(colorIdx)} className='cursor-pointer' />
                        }
                      </div>
                      <div className='p-3'>
                        <div className='flex items-center gap-4'>
                          <div className='flex-1'>
                            <p className='text-sm'>Hex Code</p>
                            <input type='color' className='mt-4 w-full outline-none' value={item.hexCode} onChange={e => handleSetColor(e, colorIdx, 'hexCode')} />
                          </div>
                          <div className='flex-1'>
                            <p className='text-sm'>Color Name</p>
                            <input type='text' className='mt-4 w-full outline-none border border-gray-300 rounded-md text-sm p-3' value={item.colorName} onChange={e => handleSetColor(e, colorIdx, 'colorName')} />
                          </div>
                        </div>
                        <hr className='mt-5 mb-4' />
                        <div>
                          <p className='text-sm'>Stock</p>
                          <div className='grid grid-cols-3 gap-4 mt-4'>
                            {
                              item.sizes.map((size, sizeIdx) => (
                                <div key={sizeIdx}>
                                  <label className='text-sm'>Size {size.size}</label>
                                  <input type='number' className='outline-none border border-gray-300 p-3 text-sm flex-1 rounded-md mt-4 w-full' value={size.stock} onChange={e => handleChangeStock(e, sizeIdx, colorIdx)} />
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <p onClick={handleAddColor} className='text-blue-500 text-sm hover:underline cursor-pointer mt-4 w-fit'>Add Color</p>
              </div>
              <div className='mb-6'>
                <p className='text-sm'>Size Chart</p>
                {
                  sizeChart.map((item, arrIdx) => (
                    <div key={arrIdx} className='border border-gray-300 rounded-md mt-4'>
                      <div className='p-3 border-b border-gray-300'>
                        {/* @ts-ignore */}
                        <p className='text-sm font-semibold'>Size {item.size}</p>
                      </div>
                      <div className='grid grid-cols-3 gap-4 p-3'>
                        {
                          Object.keys(item).map((key, keyIdx) => (
                            key !== 'size' &&
                            <div key={keyIdx} className='mb-6'>
                              <p className='text-sm'>{key}</p>
                              {/* @ts-ignore */}
                              <input type='text' name={key} value={sizeChart[arrIdx][key]} onChange={e => handleChangeSizeChart(e, arrIdx)} className='w-full outline-none border border-gray-300 px-2 py-3 text-sm rounded-md mt-4' />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </>
          }
          <div className='mb-6'>
            <label htmlFor='image' className='text-sm'>Image</label>
            <input type='file' onChange={handleChangeImage} accept='image/*' multiple className='w-full outline-none border border-gray-300 p-3 text-sm mt-4 rounded-md' />
            {
              images.length > 0 &&
              <div className='mt-4 flex items-center flex-wrap gap-4'>
                {
                  images.map((img, idx) => (
                    <div key={idx} className='w-20 h-20 rounded-md bg-gray-100 border border-gray-300 relative'>
                      <img src={URL.createObjectURL(img)} alt={`${APP_NAME} ${productData.name}`} className='w-full h-full object-cover rounded-md' />
                      <div onClick={() => handleRemoveImage(idx)} className='bg-red-500 text-white text-xs p-1 outline outline-offset-2 outline-white rounded-full absolute w-fit -top-2 -right-2 cursor-pointer'>
                        <AiOutlineClose />
                      </div>
                    </div>
                  ))
                }
              </div>
            }
          </div>
          <div className='flex justify-end'>
            <button disabled={loading} className={`${!loading ? 'bg-black hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed'} text-white rounded-md text-sm px-6 py-2 transition`}>
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

export default UpsertProduct