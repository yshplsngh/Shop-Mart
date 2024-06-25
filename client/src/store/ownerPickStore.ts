import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../utils/fetchData'
import { GlobalStoreState, IOwnerPickState } from './../utils/interface'

const ownerPickState: IOwnerPickState = {
  data: [],
  loading: false
}

const ownerPickStore = (set: any) => {
  return {
    ownerPickState,
    createOwnerPick: async(data: object, token: string) => {
      try {
        const res = await postDataAPI('/ownerPick', data, token)

        set((state: GlobalStoreState) => {
          state.ownerPickState.data = [res.data.ownerPick, ...state.ownerPickState.data]
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'create_owner_pick/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'create_owner_pick/error')
      }
    },
    readOwnerPick: async() => {
      try {
        set((state: GlobalStoreState) => {
          state.ownerPickState.loading = true
        }, false, 'read_owner_pick/loading')

        const res = await getDataAPI('/ownerPick')
        set((state: GlobalStoreState) => {
          state.ownerPickState.data = res.data.ownerPick
        }, false, 'read_owner_pick/success')

        set((state: GlobalStoreState) => {
          state.ownerPickState.loading = false
        }, false, 'read_owner_pick/done_loading')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.ownerPickState.data = []
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'read_owner_pick/error')
      }
    },
    updateOwnerPick: async(data: object, id: string, token: string) => {
      try {
        const res = await patchDataAPI(`/ownerPick/${id}`, data, token)

        set((state: GlobalStoreState) => {
          state.ownerPickState.data = state.ownerPickState.data.map(item => item._id === id ? res.data.ownerPick : item)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'update_owner_pick/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.reesponse.data.msg
          state.alertState.type = 'error'
        }, false, 'update_owner_pick/success')
      }
    },
    deleteOwnerPick: async(id: string, token: string) => {
      try {
        const res = await deleteDataAPI(`/ownerPick/${id}`, token)

        set((state: GlobalStoreState) => {
          state.ownerPickState.data = state.ownerPickState.data.filter(item => item._id !== id)
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'delete_owner_pick/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'delete_owner_pick/error')
      }
    }
  }
}

export default ownerPickStore