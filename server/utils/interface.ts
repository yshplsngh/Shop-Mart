import { Request } from 'express'
import { ObjectId, Date } from 'mongoose'

export interface IGeneralField {
  _id: string
  createdAt: Date
  updatedAt: Date
  _doc?: any
}

export interface IDecodedToken {
  id: string
}

export interface IUser extends IGeneralField {
  name: string
  avatar: string
  gender: string
  email: string
  handphoneNo: string
  password: string
  role: string
  isValidEmail: number
  isValidPhone: number
}

export interface IReqUser extends Request {
  user?: IUser
}

export interface ICategory extends IGeneralField {
  name: string
  availableSizes: string[]
  availableSizeParameters: string[]
  sizeChart: object[]
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
  category: ObjectId
  colors: IProductColor[]
  images: string[]
  sizeChart: object[]
}

export interface IProductDiscount extends IGeneralField {
  product: ObjectId
  percentage: number
  startDate: Date
  endDate: Date
  active: number
}

export interface IOwnerPick extends IGeneralField {
  product: ObjectId
}