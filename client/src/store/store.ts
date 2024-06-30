import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import alertStore from './alertStore'
import bottomAlertStore from './bottomAlertStore'
import userStore from './userStore'
import categoryStore from './categoryStore'
import productStore from './productStore'
import productDiscountStore from './productDiscountStore'
import ownerPickStore from './ownerPickStore'
import cartStore from './cartStore'
import wishlistStore from './wishlistStore'
import customerOrderStore from './customerOrderStore'
import orderHistoryStore from './orderHistoryStore'

let combineStores = (set: any) => ({
  ...alertStore(set),
  ...bottomAlertStore(set),
  ...userStore(set),
  ...categoryStore(set),
  ...productStore(set),
  ...productDiscountStore(set),
  ...ownerPickStore(set),
  ...cartStore(set),
  ...wishlistStore(set),
  ...customerOrderStore(set),
  ...orderHistoryStore(set)
})

export default create(devtools(combineStores))