import { getDataAPI, postDataAPI } from '../utils/fetchData'
import { GlobalStoreState, ICategoryState } from './../utils/interface'

const categoryState: ICategoryState = {
  data: [],
  totalPage: 0,
  totalData: 0,
  loading: false
}

const categoryStore = (set: any) => {
  return {
    categoryState,
    createCategory: async(data: object, token: string) => {
      try {
        const res = await postDataAPI('/category', data, token)

        set((state: GlobalStoreState) => {
          if (categoryState.data.length < 9) {
            state.categoryState.data = [res.data.category, ...state.categoryState.data]
            state.categoryState.totalData = state.categoryState.totalData + 1
          } else {
            state.categoryState.data = [res.data.category, ...state.categoryState.data.slice(0, 8)]
            state.categoryState.totalData = state.categoryState.totalData + 1
            state.categoryState.totalPage = state.categoryState.totalPage + 1
          }
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'create_category/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.categoryState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'create_category/error')
      }
    },
    readCategory: async(token: string, page: number, limit: number) => {
      set((state: GlobalStoreState) => {
        state.categoryState.loading = true
      }, false, 'read_category/loading')
      
      try {
        const res = await getDataAPI(`/category?page=${page}&limit=${limit}`, token)

        set((state: GlobalStoreState) => {
          state.categoryState.data = res.data.category
          state.categoryState.totalPage = res.data.totalPage
          state.categoryState.totalData = res.data.totalData
        }, false, 'read_category/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.categoryState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_category/error')
      }

      set((state: GlobalStoreState) => {
        state.categoryState.loading = false
      }, false, 'read_category/dnoe_loading')
    }
  }
}

export default categoryStore