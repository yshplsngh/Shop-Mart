import { useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { FormChanged, FormSubmitted } from '../../../utils/interface'
import { APP_NAME } from '../../../utils/constant'

interface IProps {
  openUpsertProductModal: boolean
  setOpenUpsertProductModal: React.Dispatch<React.SetStateAction<boolean>>
  upsertProductModalRef: React.MutableRefObject<HTMLDivElement>
}

const UpsertProduct: React.FC<IProps> = ({ openUpsertProductModal, setOpenUpsertProductModal, upsertProductModalRef }) => {
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

  const [images, setImages] = useState<any[]>([])

  const handleChange = (e: FormChanged) => {
    const { name, value } = e.target
    setProductData({ ...productData, [name]: value })
  }

  const handleChangeImage = (e: FormChanged) => {
    const target = e.target as HTMLInputElement
    const files = [...Object.values(target.files!)]
    setImages([...images, ...files])
  }

  const handleRemoveImage = (idx: number) => {
    const newImage = [...images]
    newImage.splice(idx, 1)
    setImages(newImage)
  }

  const handleSubmit = (e: FormSubmitted) => {
    e.preventDefault()
  }

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
              <div className='flex items-center gap-2 border border-gray-300 rounded-md p-3 text-sm'>
                <input type='text' id='category' name='category' value={productData.category} onChange={handleChange} className='outline-none flex-1' />
                <AiOutlineSearch />
              </div>
              {/* <div className='absolute left-0 top-full bg-whte rounded-md mt-2 shadow-lg w-full border border-gray-300'>
                <div className='hover:bg-gray-100 transition cursor-pointer w-full p-3 rounded-t-md border-b border-gray-300'>
                  <p>Shirt</p>
                </div>
                <div className='hover:bg-gray-100 transition cursor-pointer w-full p-3 rounded-b-md'>
                  <p>Jacket</p>
                </div>
              </div> */}
            </div>
          </div>

          <div className='mb-6'>
            <p className='text-sm'>Product Color</p>
            {/* color #n */}
            <div className='rounded-md border border-gray-300 mt-4'>
              <div className='p-3 border-b border-gray-300'>
                <p className='text-sm font-semibold'>Color #FFFFFF</p>
              </div>
              <div className='p-3'>
                <div className='flex items-center gap-4'>
                  <div className='flex-1'>
                    <p className='text-sm'>Hex Code</p>
                    <input type='color' className='mt-4 w-full outline-none' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm'>Color Name</p>
                    <input type='text' className='mt-4 w-full outline-none border border-gray-300 rounded-md text-sm p-3' />
                  </div>
                </div>
                <hr className='mt-5 mb-4' />
                <div>
                  <p className='text-sm'>Stock</p>
                  <div className='grid grid-cols-3 gap-4 mt-4'>
                    <div>
                      <div className='flex items-center gap-3'>
                        <p className='text-sm'>Size S</p>
                        <input type='checkbox' />
                      </div>
                      <input type='number' className='outline-none border border-gray-300 p-3 text-sm flex-1 rounded-md mt-4 w-full' />
                    </div>
                    <div>
                      <div className='flex items-center gap-3'>
                        <p className='text-sm'>Size S</p>
                        <input type='checkbox' />
                      </div>
                      <input type='number' className='outline-none border border-gray-300 p-3 text-sm flex-1 rounded-md mt-4 w-full' />
                    </div>
                    <div>
                      <div className='flex items-center gap-3'>
                        <p className='text-sm'>Size S</p>
                        <input type='checkbox' />
                      </div>
                      <input type='number' className='outline-none border border-gray-300 p-3 text-sm flex-1 rounded-md mt-4 w-full' />
                    </div>
                    <div>
                      <div className='flex items-center gap-3'>
                        <p className='text-sm'>Size S</p>
                        <input type='checkbox' />
                      </div>
                      <input type='number' className='outline-none border border-gray-300 p-3 text-sm flex-1 rounded-md mt-4 w-full' />
                    </div>
                    <div>
                      <div className='flex items-center gap-3'>
                        <p className='text-sm'>Size S</p>
                        <input type='checkbox' />
                      </div>
                      <input type='number' className='outline-none border border-gray-300 p-3 text-sm flex-1 rounded-md mt-4 w-full' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className='text-blue-500 text-sm hover:underline cursor-pointer mt-4 w-fit'>Add Color</p>
          </div>
          <div className='mb-6'>
            <p className='text-sm'>Size Chart</p>
            <div className='border border-gray-300 rounded-md mt-4'>
              <div className='p-3 border-b border-gray-300'>
                <p className='text-sm font-semibold'>Size S</p>
              </div>
              <div className='grid grid-cols-3 gap-4 p-3'>
                <div>
                  <p className='text-sm'>Lingkar Dada</p>
                  <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
                </div>
                <div>
                  <p className='text-sm'>Lingkar Dada</p>
                  <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
                </div>
                <div>
                  <p className='text-sm'>Lingkar Dada</p>
                  <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
                </div>
              </div>
            </div>
            <div className='border border-gray-300 rounded-md mt-4'>
              <div className='p-3 border-b border-gray-300'>
                <p className='text-sm font-semibold'>Size S</p>
              </div>
              <div className='grid grid-cols-3 gap-4 p-3'>
                <div>
                  <p className='text-sm'>Lingkar Dada</p>
                  <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
                </div>
                <div>
                  <p className='text-sm'>Lingkar Dada</p>
                  <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
                </div>
                <div>
                  <p className='text-sm'>Lingkar Dada</p>
                  <input type='number' className='w-full outline-none border border-gray-300 rounded-md text-sm p-3 mt-4' />
                </div>
              </div>
            </div>
          </div>
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
            <button className='bg-black text-white rounded-md text-sm px-6 py-2 transition hover:bg-gray-800'>Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpsertProduct