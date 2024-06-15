import { GlobalStoreState, IAlertState } from './../utils/interface'

const alertState: IAlertState = {
  message: '',
  type: ''
}

const alertStore = (set: any) => {
  return {
    alertState,
    initiate: (msg: string, type: string) => {
      set((state: GlobalStoreState) => {
        state.alertState.message = msg
        state.alertState.type = type
      }, false, 'alert/initiate')
    },
    clear: () => {
      set((state: GlobalStoreState) => {
        state.alertState.message = ''
        state.alertState.type = ''
      }, false, 'alert/clear')
    }
  }
}

export default alertStore