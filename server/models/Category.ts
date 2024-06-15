import mongoose from 'mongoose'
import { ICategory } from './../utils/interface'

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  availableSizes: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  availableSizeParameters: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  sizeChart: [Object]
}, {
  timestamps: true
})

export default mongoose.model<ICategory>('category', categorySchema)