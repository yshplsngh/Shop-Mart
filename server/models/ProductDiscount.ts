import mongoose from 'mongoose'
import { IProductDiscount } from '../utils/interface'

const productDiscountSchema = new mongoose.Schema<IProductDiscount>({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'product'
  },
  percentage: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  active: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model<IProductDiscount>('productDiscount', productDiscountSchema)