import mongoose from 'mongoose'
import { IWishlist } from './../utils/interface'

const wishlistSchema = new mongoose.Schema<IWishlist>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'product'
  }
}, {
  timestamps: true
})

export default mongoose.model<IWishlist>('wishlist', wishlistSchema)