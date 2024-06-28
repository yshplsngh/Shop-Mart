import mongoose from 'mongoose'
import { ICart } from './../utils/interface'

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'product'
  },
  qty: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: Object,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  selected: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model<ICart>('cart', cartSchema)