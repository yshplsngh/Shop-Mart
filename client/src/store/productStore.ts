import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../utils/fetchData'
import { uploadImages } from '../utils/image'
import { GlobalStoreState, IProductState } from './../utils/interface'

const productState: IProductState = {
  data: [],
  totalPage: 0,
  totalData: 0,
  loading: false
}

const productStore = (set: any) => {
  return {
    productState,
    createProduct: async(data: object, token: string) => {
      try {
        // @ts-ignore
        const imageRes = await uploadImages(data.images, 'product')
        const res = await postDataAPI('/product', { ...data, images: imageRes }, token)

        set((state: GlobalStoreState) => {
          let newData = []
          if (state.productState.data.length === 9) {
            newData = [res.data.product, ...state.productState.data.slice(0, 8)]
            if (state.productState.totalData % 9 === 0) {
              state.productState.totalPage += 1
            }
            state.productState.totalData += 1
          } else {
            newData = [res.data.product, ...state.productState.data]
          }

          state.productState.data = newData
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'create_product/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'create_product/error')
      }
    },
    readProduct: async(page: number, limit: number, search?: string) => {
      set((state: GlobalStoreState) => {
        state.productState.loading = true
      }, false, 'read_product/loading')

      try {
        const res = await getDataAPI(`/product?page=${page}&limit=${limit}&search=${search}`)

        set((state: GlobalStoreState) => {
          state.productState.data = res.data.product
          state.productState.totalPage = res.data.totalPage
          state.productState.totalData = res.data.totalData
        }, false, 'read_product/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.productState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_product/error')
      }

      set((state: GlobalStoreState) => {
        state.productState.loading = false
      }, false, 'read_product/done_loading')
    },
    updateProduct: async(id: string, data: object, token: string) => {
      try {
        // @ts-ignore
        const oldImages = data.images.filter(img => img.toString().match(/image/i))

        // @ts-ignore
        const newImages = data.images.filter(img => !img.toString().match(/image/i))

        let imageRes = []
        if (newImages.length !== 0) {
          // @ts-ignore
          imageRes = await uploadImages(newImages, 'product')
        }

        // @ts-ignore
        data.images = [ ...oldImages, ...imageRes ]

        const res = await patchDataAPI(`/product/${id}`, data, token)
        set((state: GlobalStoreState) => {
          state.productState.data = state.productState.data.map(item => item._id === id ? res.data.product : item)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'update_product/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'update_product/error')
      }
    },
    deleteProduct: async(id: string, page: number, token: string) => {
      const nextDataRes = await getDataAPI(`/product?page=${page + 1}&limit=9`, token)
      const res = await deleteDataAPI(`/product/${id}`, token)

      try {
        set((state: GlobalStoreState) => {
          const newProductData = state.productState.data.filter(item => item._id !== id)
          if (state.productState.totalData > 9) {
            if (nextDataRes.data.product[0])
              newProductData.push(nextDataRes.data.product[0])
          }
          state.productState.data = newProductData
          state.productState.totalData = state.productState.totalData - 1
  
          if (state.productState.totalData % 9 === 0) {
            state.productState.totalPage = state.productState.totalData / 9
          } else {
            state.productState.totalPage = Math.floor(state.productState.totalData / 9) + 1
          }
  
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'delete_product/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'delete_category/error')
      }
    }
  }
}

export default productStore