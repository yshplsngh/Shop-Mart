import { Request, Response } from 'express'
import Category from '../models/Category'
import { checkArrayEquality, getUniqueValues } from '../utils/helper'
import { pagination } from '../utils/pagination'
import Product from '../models/Product'

const categoryCtrl = {
  create: async(req: Request, res: Response) => {
    try {
      const { name, availableSizes, availableSizeParameters } = req.body
      if (!name || availableSizes.length < 1  || availableSizeParameters.length < 1 || availableSizes.includes('') || availableSizeParameters.includes(''))
        return res.status(400).json({ msg: 'Please provide required field to create category.' })

      const category = await Category.findOne({ name })
      if (category)
        return res.status(400).json({ msg: `${name} category has been created before.` })

      const newCategory = new Category({
        name,
        availableSizes: getUniqueValues(availableSizes),
        availableSizeParameters: getUniqueValues(availableSizeParameters)
      })
      await newCategory.save()

      return res.status(200).json({
        msg: `${name} category has been created successfully.`,
        category: newCategory
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: Request, res: Response) => {
    try {
      const { search } = req.query
      const { skip, limit } = pagination(req)
      let categoryAggregation

      if (!search) {
        categoryAggregation = await Category.aggregate([
          {
            $facet: {
              data: [
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }
              ],
              count: [
                { $count: 'count' }
              ]
            }
          },
          {
            $project: {
              count: { $arrayElemAt: ['$count.count', 0] },
              data: 1
            }
          }
        ])
      } else {
        categoryAggregation = await Category.aggregate([
          {
            $facet: {
              data: [
                { $match: { name: { $regex: new RegExp(search as string, 'i') } } },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }
              ],
              count: [
                { $match: { name: { $regex: new RegExp(search as string, 'i') } } },
                { $count: 'count' }
              ]
            }
          },
          {
            $project: {
              count: { $arrayElemAt: ['$count.count', 0] },
              data: 1
            }
          }
        ])
      }

      const category = categoryAggregation[0].data
      const categoryCount = categoryAggregation[0].count || 0
      let totalPage = 0

      if (category.length === 0) {
        totalPage = 1
      } else {
        if (categoryCount % limit === 0) {
          totalPage = categoryCount / limit
        } else {
          totalPage = Math.floor(categoryCount / limit) + 1 
        }
      }

      return res.status(200).json({
        category,
        totalData: categoryCount,
        totalPage
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  readAll: async(req: Request, res: Response) => {
    try {
      const category = await Category.find()
      return res.status(200).json({ category })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  update: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const category = await Category.findById(id)
      if (!category)
        return res.status(404).json({ msg: `Category with ID ${id} not found.` })

      const { name, availableSizes, availableSizeParameters } = req.body
      if (!name || availableSizes.length < 1 || availableSizeParameters.length < 1 || availableSizes.includes('') || availableSizeParameters.includes(''))
        return res.status(400).json({ msg: 'Please provide required field to update category.' })

      const isCategoryNameAvailable = await Category.find({ name, _id: { $ne: id } })
      if (isCategoryNameAvailable.length > 0)
        return res.status(400).json({ msg: `${name} category name has been created before.` })

      const uniqueAvailableSizes = getUniqueValues(availableSizes)
      const uniqueAvailableSizeParameters = getUniqueValues(availableSizeParameters)

      if (category.sizeChart.length > 0) {
        const currentSizes: string[] = []
        for (const chart of category.sizeChart) {
          // @ts-ignore
          currentSizes.push(chart.size)
        }

        const currentParams: string[] = []
        for (const param of Object.keys(category.sizeChart[0])) {
          if (param !== 'size') 
            currentParams.push(param)
        }

        let newParams = [...currentParams]
        const missingParamInCurrentDB = uniqueAvailableSizeParameters.filter(item => !currentParams.includes(item))
        newParams = [...newParams, ...missingParamInCurrentDB]

        const overflowParamInCurrentDB = currentParams.filter(item => !uniqueAvailableSizeParameters.includes(item))
        newParams = newParams.filter(item => !overflowParamInCurrentDB.includes(item))
        
        let newSizes = [...currentSizes]
        const missingSizeInCurrentDB = uniqueAvailableSizes.filter(item => !currentSizes.includes(item))
        newSizes = [...newSizes, ...missingSizeInCurrentDB]

        const overflowSizeInCurrentDB = currentSizes.filter(item => !uniqueAvailableSizes.includes(item))
        newSizes = newSizes.filter(item => !overflowSizeInCurrentDB.includes(item))

        let newSizeChart = category.sizeChart

        for (const param of missingParamInCurrentDB) {
          for (let i = 0; i < newSizeChart.length; i++) {
            // @ts-ignore
            newSizeChart[i][param] = ''
          }
        }

        for (const param of overflowParamInCurrentDB) {
          for (let i = 0; i < newSizeChart.length; i++) {
            // @ts-ignore
            delete newSizeChart[i][param]
          }
        }

        for (const size of missingSizeInCurrentDB) {
          const newSizeChartKey = { size }
          for (const param of newParams) {
            // @ts-ignore
            newSizeChartKey[param] = ''
          }
          newSizeChart.push(newSizeChartKey)
        }

        // @ts-ignore
        newSizeChart = newSizeChart.filter(item => newSizes.includes(item.size))

        category.sizeChart = newSizeChart
        await category.save()
      }
      
      await Category.findByIdAndUpdate(id, {
        name,
        availableSizes: uniqueAvailableSizes,
        availableSizeParameters: uniqueAvailableSizeParameters
      })

      return res.status(200).json({
        msg: `Category with ID ${id} has been updated successfully.`,
        category: {
          ...category._doc,
          name,
          availableSizes: uniqueAvailableSizes,
          availableSizeParameters: uniqueAvailableSizeParameters
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateSizeChart: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const category = await Category.findById(id)
      if (!category)
        return res.status(404).json({ msg: `Category with ID ${id} not found.` })

      const { sizeChart } = req.body
      const uniqueAvailableSizes = getUniqueValues(category.availableSizes)
      const uniqueAvailableSizeParameters = getUniqueValues(category.availableSizeParameters)

      for (const chart of sizeChart) {
        let sizeChartKey = Object.keys(chart)
        sizeChartKey = sizeChartKey.filter(item => item !== 'size')

        if (!checkArrayEquality(sizeChartKey, uniqueAvailableSizeParameters))
          return res.status(400).json({ msg: `Please provide correct size parameter for ${category.name} category.` })
      }

      const providedSizes = []
      for (const chart of sizeChart) {
        if (!Object.keys(chart).includes('size'))
          return res.status(400).json({ msg: 'Provided object key is not valid.' })

        providedSizes.push(chart.size)
      }

      if (!checkArrayEquality(providedSizes, uniqueAvailableSizes))
        return res.status(400).json({ msg: `Please provide correct size for ${category.name} category.` })

      await Category.findByIdAndUpdate(id, { sizeChart })

      return res.status(200).json({
        msg: `Category with ID ${id} size chart has been updated successfully.`,
        category: {
          ...category._doc,
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
      const category = await Category.findById(id)
      const product = await Product.find({ category: id })
      
      if (!category)
        return res.status(404).json({ msg: `Category with ID ${id} not found.` })

      if (product.length > 0)
        return res.status(400).json({ msg: `Several products still have ${category.name} category.` })

      await Category.findByIdAndDelete(id)
      return res.status(200).json({ msg: `Category with ID ${id} has been deleted successfully.` })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default categoryCtrl