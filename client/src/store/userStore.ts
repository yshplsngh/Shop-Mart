import { getDataAPI, patchDataAPI, postDataAPI } from "../utils/fetchData"
import { uploadImages } from "../utils/image"
import { GlobalStoreState, IUserState } from "../utils/interface"

interface ILoginData {
  email: string
  password: string
}

const userState: IUserState = {
  data: {},
  loading: true
}

const userStore = (set: any) => {
  return {
    userState,
    login: async(data: ILoginData) => {
      set((state: GlobalStoreState) => {
        state.userState.loading = true
      }, false, 'login/loading')

      try {
        const res = await postDataAPI('/user/login', data)

        const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
        const localStorageWishlist = JSON.parse(localStorage.getItem('ue_wishlist') || '[]')
        
        if (localStorageCart.length > 0) {
          for (let i = 0; i < localStorageCart.length; i++) {
            await postDataAPI('/cart', localStorageCart[i], res.data.accessToken)
          }

          localStorage.removeItem('ue_cart')
        }

        if (localStorageWishlist.length > 0) {
          for (let i = 0; i < localStorageWishlist.length; i++) {
            await postDataAPI('/wishlist', { product: localStorageWishlist[i]._id }, res.data.accessToken)
          }

          localStorage.removeItem('ue_wishlist')
        }

        set((state: GlobalStoreState) => {
          state.userState.data = {
            user: res.data.user,
            accessToken: res.data.accessToken
          }
          state.userState.loading = false
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'login/success')
        
        localStorage.setItem('os_auth_status', 'Y')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.userState.loading = false
          state.userState.data = {}
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'login/error')
      }
    },
    refreshToken: async() => {
      set((state: GlobalStoreState) => {
        state.userState.loading = true
      }, false, 'refresh_token/loading')

      const getLsAuth = localStorage.getItem('os_auth_status')
      if (!getLsAuth || getLsAuth !== 'Y') {
        set((state: GlobalStoreState) => {
          state.userState.loading = false
        }, false, 'refresh_token/done_loading')
        return
      }

      try {
        const res = await getDataAPI('/user/refresh_token')
        
        set((state: GlobalStoreState) => {
          state.userState.data = {
            accessToken: res.data.accessToken,
            user: res.data.user
          }
        }, false, 'refresh_token/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.userState.data = {}
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'refresh_token/error')
      }

      set((state: GlobalStoreState) => {
        state.userState.loading = false
      }, false, 'refresh_token/done_loading')
    },
    logout: async() => {
      try {
        const res = await getDataAPI('/user/logout')

        set((state: GlobalStoreState) => {
          state.userState.data = {}
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'logout/success')
        
        localStorage.removeItem('os_auth_status')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'logout/error')
      }
    },
    updateProfile: async(data: object, tempAvatar: File[], token: string) => {
      try {
        let newAvatarUrl = ''
        if (tempAvatar.length > 0) {
          const avatarUrlRes = await uploadImages(tempAvatar, 'profile')
          newAvatarUrl = avatarUrlRes[0]
        }

        // @ts-ignore
        const res = await patchDataAPI('/user/profile', { ...data, avatar: tempAvatar.length > 0 ? newAvatarUrl : data.avatar }, token)

        set((state: GlobalStoreState) => {
          state.userState.data = { ...state.userState.data, user: res.data.user }
          state.alertState.message = res.data.msg
          state.alertState.type = 'success'
        }, false, 'update_profile/success')
      } catch (err: any) {
        set((state: GlobalStoreState) => {
          state.alertState.message = err.response.data.msg
          state.alertState.type = 'error'
        }, false, 'update_profile/error')
      }
    }
  }
}

export default userStore