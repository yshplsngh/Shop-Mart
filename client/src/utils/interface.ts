import { ChangeEvent, FormEvent } from 'react'

export type FormChanged = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

export type FormSubmitted = FormEvent<HTMLFormElement>

export interface GlobalStoreState {
  alertState: IAlertState
  bottomAlertState: IBottomAlertState
  userState: IUserState
  categoryState: ICategoryState
  productState: IProductState
  productDiscountState: IProductDiscountState
  ownerPickState: IOwnerPickState
  cartState: ICartState
  wishlistState: IWishlistState
  customerOrderState: ICheckoutState
  orderHistoryState: ICheckoutState
  reviewState: IReviewState
}

export interface IGeneralField {
  _id: string
  createdAt: string
}

export interface IAlertState {
  message: string
  type: string
}

export interface IBottomAlertState {
  entity: string
  type: string
}

export interface IUserState {
  data: Partial<ILoginResponse>
  loading: boolean
}

export interface IUser {
  name: string
  avatar: string
  gender: string
  email: string
  handphoneNo: string
  password: string
  role: string
  province: string
  city: string
  district: string
  postalCode: string
  address: string
}

export interface ILoginResponse {
  user: IUser
  accessToken: string
}

export interface ICategory extends IGeneralField {
  name: string
  availableSizes: string[]
  availableSizeParameters: string[]
  sizeChart: object[]
}

export interface ICategoryState {
  data: ICategory[]
  totalPage: number
  totalData: number
  loading: boolean
}

export interface IProductColor {
  hexCode: string
  colorName: string
  sizes: IProductSize[]
}

export interface IProductSize {
  size: string
  stock: number
}

export interface IProduct extends IGeneralField {
  name: string
  shortDescription: string
  longDescription: string
  price: number
  weight: number
  width: number
  length: number
  height: number
  category: string
  colors: IProductColor[]
  images: string[]
  sizeChart: object[]
  discount: number
}

export interface IProductState {
  data: IProduct[]
  totalPage: number
  totalData: number
  loading: boolean
}

export interface IProductDiscount extends IGeneralField {
  product: IProduct
  percentage: number
  startDate: string
  endDate: string
}

export interface IProductDiscountState {
  data: IProductDiscount[]
  totalPage: number
  totalData: number
  loading: boolean
}

export interface IOwnerPick extends IGeneralField {
  product: IProduct
}

export interface IOwnerPickState {
  data: IOwnerPick[]
  loading: boolean
}

export interface ICart {
  product: IProduct
  qty: number
  size: string
  color: IProductColor
  discount: number
  stock: number
  selected: boolean
}

export interface ICartState {
  data: ICart[]
  loading: boolean
}

export interface IWishlistState {
  data: IProduct[]
  loading: boolean
}

export interface ICheckoutUser {
  _id: string
  name: string
}

export interface ICheckoutItem {
  name: string
  images: string[]
  price: number
  size: string
  color: string
  qty: number
  discount: number
}

export interface ICheckout extends IGeneralField {
  xenditId: string
  user: ICheckoutUser
  item: ICheckoutItem[]
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  province: string
  city: string
  district: string
  postalCode: string
  courier: string
  service: string
  subtotal: number
  shippingCost: number
  total: number
  paymentStatus: string
  paymentMethod: string
  waybill: string
  complete: boolean
}

export interface ICheckoutState {
  data: ICheckout[]
  loading: boolean
  totalPage: number
  totalData: number
}

export interface IReview extends IGeneralField {
  user: IUser
  product: string
  star: number
  content: string
}

export interface IReviewState {
  data: IReview[]
  loading: boolean
  totalPage: number
  totalData: number
}