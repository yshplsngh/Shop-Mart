import { GlobalStoreState, IBottomAlertState } from './../utils/interface'

const bottomAlertState: IBottomAlertState = {
  entity: '',
  type: ''
}

const bottomAlertStore = (set: any) => {
  return {
    bottomAlertState,
    initiateBottomAlert: (entity: string, type: string) => {
      set((state: GlobalStoreState) => {
        state.bottomAlertState.entity = entity
        state.bottomAlertState.type = type
      }, false, 'bottom_alert/initiate')
    },
    clearBottomAlert: () => {
      set((state: GlobalStoreState) => {
        state.bottomAlertState.entity = ''
        state.bottomAlertState.type = ''
      }, false, 'bottom_alert/clear')
    }
  }
}

export default bottomAlertStore