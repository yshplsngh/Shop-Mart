import { getDataAPI, patchDataAPI } from '../utils/fetchData'
import { GlobalStoreState, ICheckoutState } from './../utils/interface'

const orderHistoryState: ICheckoutState = {
  data: [],
  loading: false,
  totalPage: 0,
  totalData: 0
}

const orderHistoryStore = (set: any) => {
  return {
    orderHistoryState,
    readOrderHistory: async(token: string, page: number, limit: number, status: string) => {
      set((state: GlobalStoreState) => {
        state.orderHistoryState.loading = true
      }, false, 'read_order_history/loading')

      try {
        const res = await getDataAPI(`/checkout?page=${page}&limit=${limit}&status=${status}`, token)

        set((state: GlobalStoreState) => {
          state.orderHistoryState.data = res.data.checkout
          state.orderHistoryState.totalPage = res.data.totalPage
          state.orderHistoryState.totalData = res.data.totalData
        }, false, 'read_order_history/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.orderHistoryState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_order_history/error')
      }

      set((state: GlobalStoreState) => {
        state.orderHistoryState.loading = false
      }, false, 'read_order_history/done_loading')
    },
    completeOrder: async(id: string, token: string) => {
      try {
        const res = await patchDataAPI(`/checkout/${id}/complete`, { id }, token)

        set((state: GlobalStoreState) => {
          state.orderHistoryState.data = state.orderHistoryState.data.filter(item => item._id !== id)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'complete_order/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'complete_order/error')
      }
    }
  }
}

export default orderHistoryStore