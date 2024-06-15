import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../utils/fetchData'
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
          let newData = []
          if (state.categoryState.data.length === 9) {
            newData = [res.data.category, ...state.categoryState.data.slice(0, 8)]
            if (state.categoryState.totalData % 9 === 0) {
              state.categoryState.totalPage += 1
            }
            state.categoryState.totalData += 1
          } else {
            newData = [res.data.category, ...state.categoryState.data]
          }
          state.categoryState.data = newData
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'create_category/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
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
      }, false, 'read_category/done_loading')
    },
    updateCategory: async(data: object, id: string, token: string) => {
      try {
        const res = await patchDataAPI(`/category/${id}`, data, token)

        set((state: GlobalStoreState) => {
          state.categoryState.data = state.categoryState.data.map(item => item._id === id ? res.data.category : item)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'update_category/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'update_category/error')
      }
    },
    deleteCategory: async(id: string, page: number, token: string) => {
      try {
        const nextDataRes = await getDataAPI(`/category?page=${page + 1}&limit=9`, token)
        const res = await deleteDataAPI(`/category/${id}`, token)

        set((state: GlobalStoreState) => {
          const newCategoryData = state.categoryState.data.filter(item => item._id !== id)
          if (state.categoryState.totalData > 9) {
            if (nextDataRes.data.category[0])
              newCategoryData.push(nextDataRes.data.category[0])
          }
          state.categoryState.data = newCategoryData
          state.categoryState.totalData = state.categoryState.totalData - 1

          if (state.categoryState.totalData % 9 === 0) {
            state.categoryState.totalPage = state.categoryState.totalData / 9
          } else {
            state.categoryState.totalPage = Math.floor(state.categoryState.totalData / 9) + 1
          }

          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'delete_category/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'delete_category/error')
      }
    }
  }
}

export default categoryStore