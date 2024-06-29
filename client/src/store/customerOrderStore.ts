import { getDataAPI, patchDataAPI } from "../utils/fetchData";
import { GlobalStoreState, ICheckoutState } from "../utils/interface";

const customerOrderState: ICheckoutState = {
  data: [],
  loading: false,
  totalPage: 0,
  totalData: 0
}

const customerOrderStore = (set: any) => {
  return {
    customerOrderState,
    readCustomerOrder: async(token: string, page: number, limit: number, status: string) => {
      set((state: GlobalStoreState) => {
        state.customerOrderState.loading = true
      }, false, 'read_customer_order/loading')

      try {
        const res = await getDataAPI(`/checkout/admin?page=${page}&limit=${limit}&status=${status}`, token)

        set((state: GlobalStoreState) => {
          state.customerOrderState.data = res.data.checkout
          state.customerOrderState.totalData = res.data.totalData
          state.customerOrderState.totalPage = res.data.totalPage
        }, false, 'read_customer_order/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.customerOrderState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_customer_order/error')
      }

      set((state: GlobalStoreState) => {
        state.customerOrderState.loading = false
      }, false, 'read_customer_order/done_loading')
    },
    updateWaybill: async(id: string, waybill: string, token: string) => {
      try {
        const res = await patchDataAPI(`/checkout/${id}/waybill`, { waybill }, token)

        set((state: GlobalStoreState) => {
          state.customerOrderState.data = state.customerOrderState.data.map(item => item._id === id ? { ...item, waybill } : item)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'update_order_waybill/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'update_order_waybill/error')
      }
    }
  }
}

export default customerOrderStore