import mongoose from 'mongoose'
import { IReview } from '../utils/interface'

const reviewSchema = new mongoose.Schema<IReview>({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'product'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  star: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model<IReview>('review', reviewSchema)