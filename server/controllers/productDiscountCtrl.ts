import { Request, Response } from 'express'
import { convertToIdnDate } from '../utils/date'
import ProductDiscount from '../models/ProductDiscount'
import { pagination } from '../utils/pagination'
import Product from '../models/Product'

const productDiscountCtrl = {
  create: async(req: Request, res: Response) => {
    try {
      const { product, percentage, startDate, endDate } = req.body

      if (!product || percentage < 1 || !startDate || !endDate)
        return res.status(400).json({ msg: 'Please provide required field to create product discount.' })

      const matchedProduct = await Product.findById(product)
      if (!matchedProduct)
        return res.status(404).json({ msg: `Product with ID ${product} not found.` })

      if (new Date(startDate) < new Date())
        return res.status(400).json({ msg: 'Discount start date and time should be greater than now.' })
      
      if (convertToIdnDate(endDate) <= convertToIdnDate(startDate))
        return res.status(400).json({ msg: 'Discount end date and time should be greater than the start date and time.' })

      const productDiscount = await ProductDiscount.findOne({ product })
      if (productDiscount)
        return res.status(400).json({ msg: `Product with ID ${product} is currently on discount.` })

      const newProductDiscount = new ProductDiscount({
        product,
        percentage,
        startDate: convertToIdnDate(startDate),
        endDate: convertToIdnDate(endDate)
      })
      await newProductDiscount.save()

      return res.status(200).json({
        msg: `Product with ID ${product} has been applied to ${percentage}% discount`,
        productDiscount: {
          ...newProductDiscount._doc,
          product: matchedProduct
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: Request, res: Response) => {
    try {
      const { active } = req.query
      const { skip, limit } = pagination(req)

      const dataAggregation: any[] = [
        {
          $lookup: {
            'from': 'products',
            'localField': 'product',
            'foreignField': '_id',
            'as': 'product'
          }
        },
        { $unwind: '$product' },
        { $sort: { createdAt: -1 }},
        { $skip: skip },
        { $limit: limit }
      ]

      const countAggregation: any[] = [
        { $count: 'count' }
      ]

      if (active) {
        dataAggregation.unshift({
          $match: { active: Number(active) }
        })

        countAggregation.unshift({
          $match: { active: Number(active) }
        })
      }

      const productDiscountAggregation = await ProductDiscount.aggregate([
        {
          $facet: {
            data: dataAggregation,
            count: countAggregation
          }
        },
        {
          $project: {
            count: { $arrayElemAt: ['$count.count', 0] },
            data: 1
          }
        }
      ])

      const productDiscount = productDiscountAggregation[0].data
      const productDiscountCount = productDiscountAggregation[0].count || 0
      let totalPage = 0

      if (productDiscount.length === 0) {
        totalPage = 1
      } else {
        if (productDiscountCount % limit === 0) {
          totalPage = productDiscountCount / limit
        } else {
          totalPage = Math.floor(productDiscountCount / limit) + 1
        }
      }

      return res.status(200).json({
        productDiscount,
        totalData: productDiscountCount,
        totalPage
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const productDiscount = await ProductDiscount.findById(id)
      if (!productDiscount)
        return res.status(404).json({ msg: `Product discount with ID ${id} not found.` })

      const product = await Product.findById(productDiscount.product)

      const { percentage, startDate, endDate } = req.body
      if (percentage < 1)
        return res.status(400).json({ msg: 'Product discount percentage should be greater than 0.' })
    
      if (percentage > 100)
        return res.status(400).json({ msg: 'Product discount percentage shouldn\'t be greater than 100' })

      if (new Date(startDate) < new Date())
        return res.status(400).json({ msg: 'Product discount start date and time should be greater than today.' })

      if (convertToIdnDate(endDate) <= convertToIdnDate(startDate))
        return res.status(400).json({ msg: 'Product discount end date and time should be greater than the start date and time.' })

      await ProductDiscount.findByIdAndUpdate(id, {
        percentage,
        startDate: convertToIdnDate(startDate),
        endDate: convertToIdnDate(endDate)
      })

      return res.status(200).json({
        msg: `Product discount with ID ${id} has been updated successfully.`,
        productDiscount: {
          ...productDiscount._doc,
          product,
          percentage,
          startDate: convertToIdnDate(startDate),
          endDate: convertToIdnDate(endDate)
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const productDiscount = await ProductDiscount.findById(id)
      if (!productDiscount)
        return res.status(404).json({ msg: `Product discount with ID ${id} not found.` })

      await ProductDiscount.findByIdAndDelete(id)

      return res.status(200).json({
        msg: `Product discount with ID ${id} has been deleted successfully.`
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default productDiscountCtrl