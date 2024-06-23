import mongoose from 'mongoose'
import { Request, Response } from 'express'
import Category from '../models/Category'
import { checkArrayEquality } from '../utils/helper'
import Product from '../models/Product'
import { pagination } from '../utils/pagination'
import ProductDiscount from '../models/ProductDiscount'

const productCtrl = {
  create: async(req: Request, res: Response) => {
    try {
      const {
        name,
        shortDescription,
        longDescription,
        price,
        weight,
        width,
        length,
        height,
        category,
        colors,
        images,
        sizeChart
      } = req.body

      if (
        !name ||
        !shortDescription ||
        !longDescription ||
        price < 1 ||
        weight < 1 ||
        width  < 1 ||
        length < 1 ||
        height < 1 ||
        !category ||
        colors.length < 1 ||
        images.length < 1 ||
        sizeChart.length < 1
      )
        return res.status(400).json({ msg: 'Please provide required field to create new product.' })

      const matchedCategory = await Category.findById(category)
      if (!matchedCategory)
        return res.status(404).json({ msg: `Category with ID ${category} not found.` })

      const categorySizeParameters = matchedCategory.availableSizeParameters
      for (const sizeChartKey of sizeChart) {
        const currentSizeChartKey = Object.keys(sizeChartKey).filter(item => item !== 'size')
        if (!checkArrayEquality(currentSizeChartKey, categorySizeParameters))
          return res.status(400).json({ msg: 'Size chart object key is incorrect.' })
      }

      const categorySizes = matchedCategory.availableSizes
      const providedSize = []
      for (const size of sizeChart) {
        providedSize.push(size.size)
      }

      if (!checkArrayEquality(providedSize, categorySizes))
        return res.status(400).json({ msg: 'Please provide the correct sizes for current selected product category.' })

      const nonNullableFieldCheck = Object.keys(sizeChart[0]).filter(item => item !== 'size')
      for (const chart of sizeChart) {
        for (const field of nonNullableFieldCheck) {
          if (!chart[field])
            return res.status(400).json({ msg: 'Please provide product size chart.' })
        }
      }

      const colorsKey = ['hexCode', 'colorName', 'sizes']
      const sizesKey = ['size', 'stock']
      for (const color of colors) {
        const providedColorKeys = Object.keys(color)
        if (!checkArrayEquality(providedColorKeys, colorsKey))
          return res.status(400).json({ msg: 'Colors object key is incorrect.' })

        for (const size of color.sizes) {
          const providedSizeKeys = Object.keys(size)
          if (!checkArrayEquality(providedSizeKeys, sizesKey))
            return res.status(400).json({ msg: 'Sizes object key is incorrect.' })
        }
      }

      const product = new Product({
        name,
        shortDescription,
        longDescription,
        price,
        weight,
        width,
        length,
        height,
        category,
        colors,
        images,
        sizeChart
      })
      await product.save()

      return res.status(200).json({
        msg: `${name} product has been created successfully.`,
        product: {
          ...product._doc,
          category: matchedCategory
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: Request, res: Response) => {
    try {
      const { search, category } = req.query
      const { skip, limit } = pagination(req)

      let categoryQuery: any = ''
      if (category)
        categoryQuery = new mongoose.Types.ObjectId(`${category}`)

      const dataAggregation: any[] = [
        {
          $lookup: {
            'from': 'categories',
            'localField': 'category',
            'foreignField': '_id',
            'as': 'category'
          }
        },
        { $unwind: '$category' },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]

      const countAggregation: any[] = [
        { $count: 'count' }
      ]

      if (categoryQuery) {
        dataAggregation.unshift({
          $match: { category: { $eq: categoryQuery } }
        })

        countAggregation.unshift({
          $match: { category: { $eq: categoryQuery } }
        })
      }

      if (search) {
        dataAggregation.unshift({
          $match: { name: { $regex: new RegExp(search as string, 'i') } }
        })

        countAggregation.unshift({
          $match: { name: { $regex: new RegExp(search as string, 'i') } }
        })
      }

      const productAggregation = await Product.aggregate([
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

      const product = productAggregation[0].data
      const productCount = productAggregation[0].count || 0
      let totalPage = 0

      if (product.length === 0) {
        totalPage = 1
      } else {
        if (productCount % limit === 0) {
          totalPage = productCount / limit
        } else {
          totalPage = Math.floor(productCount / limit) + 1
        }
      }

      return res.status(200).json({
        product,
        totalData: productCount,
        totalPage
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  readById: async(req: Request, res: Response) =>{ 
    try {
      const { id } = req.params
      const product = await Product.findById(id).populate('category')
      if (!product)
        return res.status(404).json({ msg: `Product with ID ${id} not found.` })

      return res.status(200).json({ product })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async(req: Request, res: Response) => {
    try {
      const { id } = req.params

      const product = await Product.findById(id)
      if (!product)
        return res.status(404).json({ msg: `Product with ID ${id} not found.` })

      const {
        name,
        shortDescription,
        longDescription,
        price,
        weight,
        width,
        length,
        height,
        category,
        colors,
        images,
        sizeChart
      } = req.body

      if (
        !name ||
        !shortDescription ||
        !longDescription ||
        price < 1 ||
        weight < 1 ||
        width  < 1 ||
        length < 1 ||
        height < 1 ||
        !category ||
        colors.length < 1 ||
        images.length < 1 ||
        sizeChart.length < 1
      )
        return res.status(400).json({ msg: 'Please provide required field to create new product.' })

      const matchedCategory = await Category.findById(category)
      if (!matchedCategory)
        return res.status(404).json({ msg: `Category with ID ${category} not found.` })

      const categorySizeParameters = matchedCategory.availableSizeParameters
      for (const sizeChartKey of sizeChart) {
        const currentSizeChartKey = Object.keys(sizeChartKey).filter(item => item !== 'size')
        if (!checkArrayEquality(currentSizeChartKey, categorySizeParameters))
          return res.status(400).json({ msg: 'Size chart object key is incorrect.' })
      }

      const categorySizes = matchedCategory.availableSizes
      const providedSize = []
      for (const size of sizeChart) {
        providedSize.push(size.size)
      }

      if (!checkArrayEquality(providedSize, categorySizes))
        return res.status(400).json({ msg: 'Please provide the correct sizes for current selected product category.' })

      const nonNullableFieldCheck = Object.keys(sizeChart[0]).filter(item => item !== 'size')
      for (const chart of sizeChart) {
        for (const field of nonNullableFieldCheck) {
          if (!chart[field])
            return res.status(400).json({ msg: 'Please provide product size chart.' })
        }
      }

      const colorsKey = ['hexCode', 'colorName', 'sizes', '_id']
      const sizesKey = ['size', 'stock', '_id']
      for (const color of colors) {
        const providedColorKeys = Object.keys(color)
        if (!checkArrayEquality(providedColorKeys, colorsKey))
          return res.status(400).json({ msg: 'Colors object key is incorrect.' })

        for (const size of color.sizes) {
          const providedSizeKeys = Object.keys(size)
          if (!checkArrayEquality(providedSizeKeys, sizesKey))
            return res.status(400).json({ msg: 'Sizes object key is incorrect.' })
        }
      }

      await Product.findByIdAndUpdate(id, {
        name,
        shortDescription,
        longDescription,
        price,
        weight,
        width,
        length,
        height,
        category,
        colors,
        images,
        sizeChart
      })

      return res.status(200).json({
        msg: `Product with ID ${id} has been updated successfully.`,
        product: {
          ...product._doc,
          name,
          shortDescription,
          longDescription,
          price,
          weight,
          width,
          length,
          height,
          category: matchedCategory,
          colors,
          images,
          sizeChart
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  delete: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product)
        return res.status(404).json({ msg: `Product with ID ${id} not found.` })

      await Product.findByIdAndDelete(id)

      const productDiscount = await ProductDiscount.find({ product: id })
      if (productDiscount.length > 0)
        await ProductDiscount.findByIdAndDelete(productDiscount[0]._id)

      return res.status(200).json({
        msg: `Product with ID ${id} has been deleted successfully.`,
        id
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  similarProduct: async(req: Request, res: Response) => {
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product)
      return res.status(404).json({ msg: `Product with ID ${id} not found.` })

    const similarProducts = await Product.find({ category: product.category, _id: { $ne: id } }).limit(4)
    return res.status(200).json({ similarProducts })
  }
}

export default productCtrl