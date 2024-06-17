import mongoose from 'mongoose'
import { IProduct } from './../utils/interface'

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'category'
  },
  colors: [
    {
      hexCode: {
        type: String,
        required: true,
        trim: true
      },
      colorName: {
        type: String,
        required: true,
        trim: true
      },
      sizes: [
        {
          size: {
            type: String,
            required: true,
            trim: true
          },
          stock: {
            type: Number,
            required: true
          }
        }
      ]
    }
  ],
  images: [
    {
      type: String,
      required: true
    }
  ],
  sizeChart: [Object]
}, {
  timestamps: true
})

export default mongoose.model<IProduct>('product', productSchema)