import mongoose from 'mongoose'
import { IUser } from '../utils/interface'

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  handphoneNo: {
    type: String,
    trim: true,
    unique: true,
    default: ''
  },
  password: {
    type: String,
    required: true
  },  
  role: {
    type: String,
    default: 'customer'
  },
  province: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  postalCode: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

export default mongoose.model<IUser>('user', userSchema)