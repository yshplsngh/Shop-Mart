import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import alertStore from './alertStore'
import userStore from './userStore'

let combineStores = (set: any) => ({
  ...alertStore(set),
  ...userStore(set)
})

export default create(devtools(combineStores))