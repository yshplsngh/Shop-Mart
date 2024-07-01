import { getDataAPI, postDataAPI } from '../utils/fetchData'
import { GlobalStoreState, IReviewState, IUser } from './../utils/interface'

const reviewState: IReviewState = {
  data: [],
  totalPage: 0,
  totalData: 0,
  loading: false
}


const reviewStore = (set: any) => {
  return {
    reviewState,
    createReview: async(data: object, user: IUser, token: string) => {
      try {
        const res = await postDataAPI('/review', data, token)

        set((state: GlobalStoreState) => {
          state.reviewState.data = [{ ...res.data.review, user }, ...state.reviewState.data]
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'create_review/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'create_review/error')
      }
    },
    readReview: async(id: string, page: number, limit: number) => {
      set((state: GlobalStoreState) => {
        state.reviewState.loading = true
      }, false, 'read_review/loading')

      try {
        const res = await getDataAPI(`/review/${id}?page=${page}&limit=${limit}`)

        set((state: GlobalStoreState) => {
          state.reviewState.data = res.data.review
          state.reviewState.totalData = res.data.totalData
          state.reviewState.totalPage = res.data.totalPage
        }, false, 'read_review/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_review/error')
      }

      set((state: GlobalStoreState) => {
        state.reviewState.loading = false
      }, false, 'read_review/done_loading')
    }
  }
}

export default reviewStore