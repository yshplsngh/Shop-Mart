import mongoose from 'mongoose'
import { IOwnerPick } from '../utils/interface'

const ownerPickSchema = new mongoose.Schema<IOwnerPick>({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'product'
  }
}, {
  timestamps: true
})

export default mongoose.model<IOwnerPick>('ownerPick', ownerPickSchema)