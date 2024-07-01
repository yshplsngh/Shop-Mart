import { Request, Response } from 'express'
import { IReqUser } from '../utils/interface'
import { pagination } from '../utils/pagination'
import Review from '../models/Review'
import mongoose from 'mongoose'
import Checkout from '../models/Checkout'

const reviewCtrl = {
  create: async(req: IReqUser, res: Response) => {
    try {
      const { product, star, content } = req.body

      if (!product || !star || !content)
        return res.status(400).json({ msg: 'Please provide required fied to post review.' })

      const review = await Review.find({ user: req.user?._id, product })
      const checkout = await Checkout.find({ user: req.user?._id, item: { $elemMatch: { product } }, complete: true })

      if (checkout.length === 0)
        return res.status(400).json({ msg: 'You\'re not eligible to review this product.' })

      if (review.length >= checkout.length)
        return res.status(400).json({ msg: 'You\'re not eligible to review this product.' })

      const newReview = new Review({
        user: req.user?._id,
        product,
        star,
        content
      })
      await newReview.save()

      return res.status(200).json({
        msg: 'Review has been posted successfully.',
        review: newReview
      })
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
              {
                $lookup: {
                  'from': 'users',
                  'localField': 'user',
                  'foreignField': '_id',
                  'as': 'user'
                }
              },
              { $unwind: '$user' },
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
  },
  checkReviewEligibility: async(req: IReqUser, res: Response) => {
    try {
      const { id } = req.params

      const review = await Review.find({ user: req.user?._id, product: id })
      const checkout = await Checkout.find({ user: req.user?._id, item: { $elemMatch: { product: id } }, complete: true })

      if (checkout.length === 0)
        return res.status(200).json({ eligibility: false })

      if (review.length >= checkout.length)
        return res.status(200).json({ eligibility: false })

      return res.status(200).json({ eligibility: true })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default reviewCtrl