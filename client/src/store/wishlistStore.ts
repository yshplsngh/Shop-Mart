import { deleteDataAPI, getDataAPI, postDataAPI } from '../utils/fetchData'
import { GlobalStoreState, IProduct, IWishlistState } from './../utils/interface'

const wishlistState: IWishlistState = {
  data: [],
  loading: false
}

const wishlistStore = (set: any) => {
  return {
    wishlistState,
    createWishlist: async(data: IProduct, token?: string) => {
      if (!token) {
        const localStorageWishlist = JSON.parse(localStorage.getItem('ue_wishlist') || '[]')
        let newWishlist: IProduct[] = []

        if (localStorageWishlist.length > 0) {
          const findSelectedWishlist = localStorageWishlist.find((item: IProduct) => item._id === data._id)

          if (findSelectedWishlist) {
            newWishlist = localStorageWishlist.filter((item: IProduct) => item._id !== data._id)
            
            set((state: GlobalStoreState) => {
              state.bottomAlertState.entity = 'wishlist'
              state.bottomAlertState.type = 'error'
            }, false, 'bottom_alert/initiate')
          } else {
            newWishlist = [data, ...localStorageWishlist]

            set((state: GlobalStoreState) => {
              state.bottomAlertState.entity = 'wishlist'
              state.bottomAlertState.type = 'success'
            }, false, 'bottom_alert/initiate')
          }
        } else {
          newWishlist = [data]
        }

        localStorage.setItem('ue_wishlist', JSON.stringify(newWishlist))
        set((state: GlobalStoreState) => {
          state.wishlistState.data = newWishlist
        }, false, 'create_wishlist/success')
      } else {
        let wishlistStateCopy: IProduct[] = []

        set((state: GlobalStoreState) => {
          wishlistStateCopy = [...state.wishlistState.data]
        }, false, 'create_wishlist/copy_wishlist_state')

        const findSelectedWishlist = wishlistStateCopy.find((item: IProduct) => item._id === data._id)

        if (findSelectedWishlist) {
          await deleteDataAPI(`/wishlist?product=${data._id}`, token)
          wishlistStateCopy = wishlistStateCopy.filter(item => item._id !== data._id)

          set((state: GlobalStoreState) => {
            state.bottomAlertState.entity = 'wishlist'
            state.bottomAlertState.type = 'error'
          }, false, 'bottom_alert/initiate')
        } else {
          const res = await postDataAPI('/wishlist', { product: data._id }, token)
          wishlistStateCopy = [res.data.wishlist, ...wishlistStateCopy]

          set((state: GlobalStoreState) => {
            state.bottomAlertState.entity = 'wishlist'
            state.bottomAlertState.type = 'success'
          }, false, 'bottom_alert/initiate')
        }

        set((state: GlobalStoreState) => {
          state.wishlistState.data = wishlistStateCopy
        }, false, 'create_wishlist/success')
      }
    },
    readWishlist: async(token?: string) => {
      if (!token) {
        const localStorageWishlist = JSON.parse(localStorage.getItem('ue_wishlist') || '[]')

        set((state: GlobalStoreState) => {
          state.wishlistState.data = localStorageWishlist
        }, false, 'read_wishlist/success')
      } else {
        const res = await getDataAPI('/wishlist', token)

        set((state: GlobalStoreState) => {
          state.wishlistState.data = res.data.wishlist
        }, false, 'read_wishlist/success')
      }
    },
    deleteWishlist: async(productId: string, token?: string) => {
      if (!token) {
        const localStorageWishlist = JSON.parse(localStorage.getItem('ue_wishlist') || '[]')

        const newWishlist = localStorageWishlist.filter((item: IProduct) => item._id !== productId)

        localStorage.setItem('ue_wishlist', JSON.stringify(newWishlist))

        set((state: GlobalStoreState) => {
          state.wishlistState.data = newWishlist
        }, false, 'delete_wishlist/success')
      } else {
        await deleteDataAPI(`/wishlist?product=${productId}`, token)
        const newWishlist = wishlistState.data.filter((item: IProduct) => item._id !== productId)

        set((state: GlobalStoreState) => {
          state.wishlistState.data = newWishlist
        }, false, 'delete_wishlist/success')
      }

      set((state: GlobalStoreState) => {
        state.bottomAlertState.entity = 'wishlist'
        state.bottomAlertState.type = 'error'
      }, false, 'bottom_alert/initiate')
    }
  }
}

export default wishlistStore