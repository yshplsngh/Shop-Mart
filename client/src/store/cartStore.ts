import { GlobalStoreState, ICart, ICartState } from './../utils/interface'

const cartState: ICartState = {
  data: [],
  loading: false
}

const cartStore = (set: any) => {
  return {
    cartState,
    createCart: async(data: ICart) => {
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
    },
    readCart: async() => {
      const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')

      set((state: GlobalStoreState) => {
        state.cartState.data = localStorageCart
      }, false, 'read_cart/success')
    },
    deleteCart: async(data: ICart) => {
      const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
      
      const newCart = localStorageCart.filter((item: ICart) => !(item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id))

      localStorage.setItem('ue_cart', JSON.stringify(newCart))

      set((state: GlobalStoreState) => {
        state.cartState.data = newCart
      }, false, 'delete_cart/success')
    },
    updateCartSelectedStatus: (data: ICart) => {
      const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
      const newCart = localStorageCart.map((item: ICart) => item.size === data.size && item.color.hexCode === data.color.hexCode && item.product._id === data.product._id ? { ...data, selected: data.selected ? false : true } : item)
      
      localStorage.setItem('ue_cart', JSON.stringify(newCart))
      set((state: GlobalStoreState) => {
        state.cartState.data = newCart
      }, false, 'update_cart_selected_status/success')
    },
    bulkUpdateCartSelectedStatus: (type: boolean) => {
      const localStorageCart = JSON.parse(localStorage.getItem('ue_cart') || '[]')
      
      const newCart: ICart[] = []

      for (let i = 0; i < localStorageCart.length; i++) {
        newCart.push({ ...localStorageCart[i], selected: type })
      }

      localStorage.setItem('ue_cart', JSON.stringify(newCart))

      set((state: GlobalStoreState) => {
        state.cartState.data = newCart
      }, false, 'bulk_update_cart_selected_status/success')
    }
  }
}

export default cartStore