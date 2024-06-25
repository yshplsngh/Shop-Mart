import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import alertStore from './alertStore'
import userStore from './userStore'
import categoryStore from './categoryStore'
import productStore from './productStore'
import productDiscountStore from './productDiscountStore'
import ownerPickStore from './ownerPickStore'

let combineStores = (set: any) => ({
  ...alertStore(set),
  ...userStore(set),
  ...categoryStore(set),
  ...productStore(set),
  ...productDiscountStore(set),
  ...ownerPickStore(set)
})

export default create(devtools(combineStores))