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