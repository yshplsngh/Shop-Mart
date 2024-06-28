import { Response } from 'express'
import { IReqUser } from './../utils/interface'
import Product from '../models/Product'
import Cart from '../models/Cart'
import ProductDiscount from '../models/ProductDiscount'

const cartCtrl = {
  create: async(req: IReqUser, res: Response) => {
    try {
      const { product, qty, size, color } = req.body
      
      if (!product || qty < 1 || !size || Object.keys(color).length < 1)
        return res.status(400).json({ msg: 'Please provide required field to add item to cart.' })
    
      const findCart = await Cart.findOne({ user: req.user?._id, size, product, 'color.hexCode': color.hexCode })
      if (findCart)
        return res.status(200).json({ msg: 'Skip add item to cart.' })

      const findProduct = await Product.findById(product)
      if (!findProduct)
        return res.status(404).json({ msg: `Product with ID ${product} not found.` })

      const findColor = findProduct.colors.find(item => item.hexCode === color.hexCode)
      const findStock = findColor?.sizes.find(item => item.size === size)

      if (qty > findStock?.stock!)
        return res.status(400).json({ msg: 'Quantity shouldn\'t be greater than product stock.' })

      const productDiscount = await ProductDiscount.findOne({ product })
      
      const cart = new Cart({
        user: req.user?._id,
        product,
        qty,
        size,
        color,
        discount: productDiscount?.percentage || 0
      })
      await cart.save()

      return res.status(200).json({
        cart: {
          ...cart._doc,
          product: findProduct
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: IReqUser, res: Response) => {
    try {
      const cart = await Cart.find({ user: req.user?._id }).populate('product')
      return res.status(200).json({ cart })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async(req: IReqUser, res: Response) => {
    try {
      const { qty, size, color, product } = req.body

      const cart = await Cart.findOne({ user: req.user?._id, size, product, 'color.hexCode': color })
      if (!cart)
        return res.status(404).json({ msg: 'Cart not found.' })
      
      const findProduct = await Product.findById(product)
      if (!findProduct)
        return res.status(404).json({ msg: `Product with ID ${product} not found.` })

      // @ts-ignore
      const findColor = findProduct.colors.find(item => item.hexCode === cart.color.hexCode)
      const findStock = findColor?.sizes.find(item => item.size === cart.size)

      if (qty < 1)
        return res.status(400).json({ msg: 'Quantity should be greater than 0.' })
      
      if (qty  > findStock?.stock!)
        return res.status(400).json({ msg: `Quantity shouldn\'t be greater than product stock.` })

      cart.qty = qty
      await cart.save()

      return res.status(200).json({
        cart: {
          ...cart._doc,
          qty,
          product: findProduct
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async(req: IReqUser, res: Response) => {
    try {
      const { size, color, product } = req.query
      
      const cart = await Cart.findOne({ user: req.user?._id, size, product, 'color.hexCode': `#${color}` })
      if (!cart)
        return res.status(404).json({ msg: 'Cart not found.' })

      await Cart.findByIdAndDelete(cart._id)
      
      return res.status(200).json({ msg: 'Item has been removed successfully from cart.' })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateSelected: async(req: IReqUser, res: Response) => {
    try {
      const { size, color, product } = req.body

      const cart = await Cart.findOne({ user: req.user?._id, size, product, 'color.hexCode': color })
      if (!cart)
        return res.status(404).json({ msg: 'Cart not found.' })

      cart.selected = cart.selected ? false : true
      await cart.save()

      return res.status(200).json({ cart })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  bulkUpdateSelected: async(req: IReqUser, res: Response) => {
    try {
      const { type } = req.body
      const cart = await Cart.find({ user: req.user?._id })
      
      for (let i = 0; i < cart.length; i++) {
        await Cart.findByIdAndUpdate(cart[i]._id, {
          selected: type
        })
      }

      return res.status(200).json({ msg: 'Cart item selected status has been updated successfully.' })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default cartCtrl