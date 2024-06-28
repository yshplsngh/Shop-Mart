import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../utils/fetchData'
import { GlobalStoreState, ICart, ICartState } from './../utils/interface'

const cartState: ICartState = {
  data: [],
  loading: false
}

const cartStore = (set: any) => {
  return {
    cartState,
    createCart: async(data: ICart, token?: string) => {
      if (!token) {
        const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
        let newCart: ICart[] = []
        
        if (localStorageCart.length > 0) {
          const findSelectedCart = localStorageCart.find((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id)

          if (findSelectedCart) {
            newCart = localStorageCart.map((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id ? data: item)
          } else {
            newCart = [data, ...localStorageCart]
          }
        } else {
          newCart = [data as ICart]
        }

        localStorage.setItem('ue_cart', JSON.stringify(newCart))
        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'create_cart/success')
      } else {
        let cartStateCopy: ICart[] = []

        set((state: GlobalStoreState) => {
          cartStateCopy = [...state.cartState.data]
        }, false, 'create_cart/copy_cart_state')

        const findSelectedCart = cartStateCopy.find((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id)

        if (findSelectedCart) {
          await patchDataAPI('/cart', { qty: data.qty, size: data.size, product: data.product._id, color: data.color.hexCode }, token)
          cartStateCopy = cartStateCopy.map((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id ? data : item)
        } else {
          const res = await postDataAPI('/cart', data, token)
          cartStateCopy = [res.data.cart, ...cartStateCopy]
        }

        set((state: GlobalStoreState) => {
          state.cartState.data = cartStateCopy
        }, false, 'create_cart/success')
      }

      set((state: GlobalStoreState) => {
        state.bottomAlertState.entity = 'cart'
        state.bottomAlertState.type = 'success'
      }, false, 'bottom_alert/initiate')
    },
    readCart: async(token?: string) => {
      if (!token) {
        const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')

        set((state: GlobalStoreState) => {
          state.cartState.data = localStorageCart
        }, false, 'read_cart/success')
      } else {
        const res = await getDataAPI('/cart', token)

        set((state: GlobalStoreState) => {
          state.cartState.data = res.data.cart
        }, false, 'read_cart/success')
      }
    },
    deleteCart: async(data: ICart, token?: string) => {
      if (!token) {
        const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
      
        const newCart = localStorageCart.filter((item: ICart) => !(item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id))

        localStorage.setItem('ue_cart', JSON.stringify(newCart))

        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'delete_cart/success')
      } else {
        await deleteDataAPI(`/cart?size=${data.size}&color=${data.color.hexCode.substring(1)}&product=${data.product._id}`, token)
        const newCart = cartState.data.filter((item: ICart) => !(item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id))

        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'delete_cart/success')
      }
      
      set((state: GlobalStoreState) => {
        state.bottomAlertState.entity = 'cart'
        state.bottomAlertState.type = 'error'
      }, false, 'bottom_alert/initiate')
    },
    updateCartSelectedStatus: async(data: ICart, token?: string) => {
      if (!token) {
        const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
        const newCart = localStorageCart.map((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id ? { ...data, selected: data.selected ? false : true } : item)
        
        localStorage.setItem('ue_cart', JSON.stringify(newCart))
        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'update_cart_selected_status/success')
      } else {
        const newCart = cartState.data.map((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id ? { ...data, selected: data.selected ? false : true } : item)

        await patchDataAPI('/cart/selected', { size: data.size, color: data.color.hexCode, product: data.product._id }, token)

        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'update_cart_selected_status/success')
      }
    },
    bulkUpdateCartSelectedStatus: async(type: boolean, token?: string) => {
      if (!token) {
        const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
      
        const newCart: ICart[] = []

        for (let i = 0; i < localStorageCart.length; i++) {
          newCart.push({ ...localStorageCart[i], selected: type })
        }

        localStorage.setItem('ue_cart', JSON.stringify(newCart))

        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'bulk_update_cart_selected_status/success')
      } else {
        const newCart: ICart[] = []

        set((state: GlobalStoreState) => {
          for (let i = 0; i < state.cartState.data.length; i++) {
            newCart.push({ ...state.cartState.data[i], selected: type })
          }
        }, false, 'bulk_update_cart_selected/copy_result')

        set((state: GlobalStoreState) => {
          state.cartState.data = newCart
        }, false, 'bulk_update_cart_selected/success')

        await patchDataAPI('/cart/selected/bulk', { type }, token)
      }
    }
  }
}

export default cartStore