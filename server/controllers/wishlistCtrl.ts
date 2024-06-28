import { Response } from 'express'
import { IReqUser } from './../utils/interface'
import Product from '../models/Product'
import Wishlist from '../models/Wishlist'

const wishlistCtrl = {
  create: async(req: IReqUser, res: Response) => {
    try {
      const { product } = req.body

      if (!product)
        return res.status(400).json({ msg: 'Please provide required field to add item to wishlist.' })

      const findProduct = await Product.findById(product)
      if (!findProduct)
        return res.status(404).json({ msg: `Product with ID ${product} not found.` })

      const findWishlist = await Wishlist.findOne({ user: req.user?._id, product })
      if (findWishlist)
        return res.status(200).json({ msg: 'Skip add item to wishlist.' })

      const wishlist = new Wishlist({
        user: req.user?._id,
        product
      })
      await wishlist.save()

      return res.status(200).json({
        wishlist: findProduct
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: IReqUser, res: Response) => {
    try {
      const wishlist = await Wishlist.find({ user: req.user?._id }).populate('product')
      const remappedWishlist = wishlist.map(item => item.product)
      return res.status(200).json({ wishlist: remappedWishlist   })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async(req: IReqUser, res: Response) => {
    try {
      const { product } = req.query

      const wishlist = await Wishlist.findOne({ user: req.user?._id, product })
      if (!wishlist)
        return res.status(404).json({ msg: 'Wishlist not found.' })

      await Wishlist.findByIdAndDelete(wishlist._id)

      return res.status(200).json({ msg: 'Item has been removed successfully from wishlist.' })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default wishlistCtrl