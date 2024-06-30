import { Request, Response } from 'express'
import { IReqUser } from '../utils/interface'
import { pagination } from '../utils/pagination'
import Review from '../models/Review'
import mongoose from 'mongoose'

const reviewCtrl = {
  create: async(req: IReqUser, res: Response) => {
    try {
      
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { skip, limit } = pagination(req)

      const reviewAggregation = await Review.aggregate([
        {
          $facet: {
            data: [
              { $match: { product: { $eq: new mongoose.Types.ObjectId(id) } } },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit }
            ],
            count: [
              { $match: { product: { $eq: new mongoose.Types.ObjectId(id) } } },
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

      const review = reviewAggregation[0].data
      const reviewCount = reviewAggregation[0].count || 0
      let totalPage = 0

      if (review.length === 0) {
        totalPage = 1
      } else {
        if (reviewCount % limit === 0) {
          totalPage = reviewCount / limit
        } else {
          totalPage = Math.floor(reviewCount / limit) + 1
        }
      }

      return res.status(200).json({
        review,
        totalData: reviewCount,
        totalPage
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default reviewCtrl