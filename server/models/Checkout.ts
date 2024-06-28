import mongoose from 'mongoose'
import { ICheckout } from './../utils/interface'

const checkoutSchema = new mongoose.Schema<ICheckout>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  item: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'product'
      },
      size: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      discount: {
        type: Number
      }
    }
  ],
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  courier: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  waybill: {
    type: String,
    default: ''
  },
  complete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model<ICheckout>('checkout', checkoutSchema)