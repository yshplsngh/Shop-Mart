import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../utils/fetchData"
import { GlobalStoreState, IProductDiscountState } from "../utils/interface"

const productDiscountState: IProductDiscountState = {
  data: [],
  totalPage: 0,
  totalData: 0,
  loading: false
}

const productDiscountStore = (set: any) => {
  return {
    productDiscountState,
    createProductDiscount: async(data: object, token: string) => {
      try {
        const res = await postDataAPI('/productDiscount', data, token)

        set((state: GlobalStoreState) => {
          let newData = []
          if (state.productDiscountState.data.length === 9) {
            newData = [res.data.productDiscount, ...state.productDiscountState.data.slice(0, 8)]
            if (state.productDiscountState.totalData % 9 === 0) {
              state.productDiscountState.totalPage += 1
            }
            state.productDiscountState.totalData += 1
          } else {
            newData = [res.data.productDiscount, ...state.productDiscountState.data]
          }

          state.productDiscountState.data = newData
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'create_product_discount/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'create_product_discount/error')
      }
    },
    readProductDiscount: async(token: string, page: number, limit: number, active: string) => {
      set((state: GlobalStoreState) => {
        state.productDiscountState.loading = true
      }, false, 'read_product_discount/loading')

      try {
        const res = await getDataAPI(`/productDiscount?page=${page}&limit=${limit}&active=${active}`, token)

        set((state: GlobalStoreState) => {
          state.productDiscountState.data = res.data.productDiscount
          state.productDiscountState.totalPage = res.data.totalPage
          state.productDiscountState.totalData = res.data.totalData
        }, false, 'read_product_discount/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.productDiscountState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_product_discount/error')
      }

      set((state: GlobalStoreState) => {
        state.productDiscountState.loading = false
      }, false, 'read_product_discount/done_loading')
    },
    updateProductDiscount: async(data: object, id: string, token: string) => {
      try {
        const res = await patchDataAPI(`/productDiscount/${id}`, data, token)

        set((state: GlobalStoreState) => {
          state.productDiscountState.data = state.productDiscountState.data.map(item => item._id === id ? res.data.productDiscount : item)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'update_product_discount/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'update_product_discount/error')
      }
    },
    deleteProductDiscount: async(id: string, page: number, token: string) => {
      try {
        const nextDataRes = await getDataAPI(`/productDiscount?page=${page + 1}&limit=9`, token)
        const res = await deleteDataAPI(`/productDiscount/${id}`, token)

        set((state: GlobalStoreState) => {
          const newProductDiscountData = state.productDiscountState.data.filter(item => item._id !== id)
          if (state.productDiscountState.totalData > 9) {
            if (nextDataRes.data.productDiscount[0])
              newProductDiscountData.push(nextDataRes.data.productDiscount[0])
          }
          state.productDiscountState.data = newProductDiscountData
          state.productDiscountState.totalData = state.productDiscountState.totalData - 1

          if (state.productDiscountState.totalData % 9 === 0) {
            state.productDiscountState.totalPage = state.productDiscountState.totalData / 9
          }else {
            state.productDiscountState.totalPage = Math.floor(state.productDiscountState.totalData / 9) + 1
          }

          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'delete_product_discount/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'delete_product_discount/error')
      }
    }
  }
}

export default productDiscountStore