import { Request, Response } from 'express'
import { IReqUser } from './../utils/interface'
import { checkArrayEquality } from '../utils/helper'
import Checkout from '../models/Checkout'
import { validEmail, validPhoneNumber } from '../utils/validator'
import * as Buffer from 'buffer'
import User from '../models/User'
import { pagination } from '../utils/pagination'

const checkoutCtrl = {
  create: async(req: IReqUser, res: Response) => {
    try {
      const {
        xenditId,
        item,
        firstName,
        lastName,
        email,
        phone,
        address,
        province,
        city,
        district,
        postalCode,
        courier,
        service,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
      } = req.body

      if (
        !xenditId ||
        item.length < 1 ||
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !address ||
        !province ||
        !city ||
        !district ||
        !postalCode ||
        !courier ||
        !service ||
        subtotal < 1 ||
        shippingCost < 1 ||
        total < 1 ||
        !paymentMethod
      )
        return res.status(400).json({ msg: 'Please provide required field to checkout.' })

      const itemKey = ['product', 'size', 'color', 'qty']
      
      for (let i = 0; i < item.length; i++) {
        const objKeys = Object.keys(item[i]).filter(item => item !== 'discount')
        if (!checkArrayEquality(objKeys, itemKey))
          return res.status(400).json({ msg: 'Item object key is incorrect.' })
      }

      if (!validEmail(email))
        return res.status(400).json({ msg: 'Please provide valid email address to checkout.' })

      if (!validPhoneNumber(phone))
        return res.status(400).json({ msg: 'Please provide valid phone number to checkout.' })
      
      const user = await User.findById(req.user?._id)
      if (!user)
        return res.status(400).json({ msg: 'User not found.' })

      if (!user.province) {
        user.province = province
        await user.save()
      }

      if (!user.city) {
        user.city = city
        await user.save()
      }

      if (!user.district) {
        user.district = district
        await user.save()
      }

      if (!user.postalCode) {
        user.postalCode = postalCode
        await user.save()
      }

      if (!user.handphoneNo) {
        user.handphoneNo = phone
        await user.save()
      }

      if (!user.address) {
        user.address = address
        await user.save()
      }
     
      const checkout = new Checkout({
        xenditId,
        user: req.user?._id,
        item,
        firstName,
        lastName,
        email,
        phone: `+62${phone}`,
        address,
        province,
        city,
        district,
        postalCode,
        courier,
        service,
        subtotal,
        shippingCost,
        total,
        paymentMethod
      })
      await checkout.save()

      setTimeout(async() => {
        const paymentStatusRes = await fetch(`https://api.xendit.co/ewallets/charges/${xenditId}`, {
          headers: {
            Authorization: `Basic ${Buffer.Buffer.from(`${process.env.XENDIT_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        })
        const paymentStatusResJSON = await paymentStatusRes.json()

        // @ts-ignore
        checkout.paymentStatus = paymentStatusResJSON.status
        await checkout.save()
      }, 5000)

      return res.status(200).json({ checkout })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  read: async(req: IReqUser, res: Response) => {
    try {
      
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  adminRead: async(req: Request, res: Response) => {
    try {
      const { status } = req.query
      const { skip, limit } = pagination(req)

      const dataAggregation: any[] = [
        { $unwind: '$item' },
        {
          $lookup: {
            'from': 'users',
            'localField': 'user',
            'foreignField': '_id',
            'as': 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            'from': 'products',
            'localField': 'item.product',
            'foreignField': '_id',
            'as': 'productInfo'
          }
        },
        { $unwind: '$productInfo' },
        {
          $project: {
            _id: 1,
            xenditId: 1,
            user: {
              '_id': '$user._id',
              'name': '$user.name'
            },
            item: {
              name: '$productInfo.name',
              images: '$productInfo.images',
              price: '$productInfo.price',
              size: '$item.size',
              color: '$item.color',
              qty: '$item.qty',
              discount: '$item.discount'
            },
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            address: 1,
            province: 1,
            city: 1,
            district: 1,
            postalCode: 1,
            courier: 1,
            service: 1,
            subtotal: 1,
            shippingCost: 1,
            total: 1,
            paymentStatus: 1,
            paymentMethod: 1,
            waybill: 1,
            complete: 1,
            createdAt: 1
          }
        },
        {
          $group: {
            _id: '$_id',
            xenditId: { $first: '$xenditId' },
            user: { $first: '$user' },
            item: { $push: '$item' },
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            address: { $first: '$address' },
            province: { $first: '$province' },
            city: { $first: '$city' },
            district: { $first: '$district' },
            postalCode: { $first: '$postalCode' },
            courier: { $first: '$courier' },
            service: { $first: '$service' },
            subtotal: { $first: '$subtotal' },
            shippingCost: { $first: '$shippingCost' },
            total: { $first: '$total' },
            paymentStatus: { $first: '$paymentStatus' },
            paymentMethod: { $first: '$paymentMethod' },
            waybill: { $first: '$waybill' },
            complete: { $first: '$complete' },
            createdAt: { $first: '$createdAt' }
          }
        },
        { $sort: { createdAt: 1 } },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit }
            ],
            totalCount: [ { $count: 'count' } ]
          }
        }
      ]

      if (status === 'onProcess') {
        dataAggregation.unshift({
          $match: { waybill: { $eq: '' } }
        })

        dataAggregation.unshift({
          $match: { complete: { $eq: false} }
        })
      } else if (status === 'onDelivery') {
        dataAggregation.unshift({
          $match: { waybill: { $ne: '' } }
        })

        dataAggregation.unshift({
          $match: { complete: { $eq: false} }
        })
      } else if (status === 'complete') {
        dataAggregation.unshift({
          $match: { complete: true }
        })
      }

      const chceckoutAggregation = await Checkout.aggregate(dataAggregation)

      const checkout = chceckoutAggregation[0].data
      const checkoutCount = chceckoutAggregation[0].totalCount[0]?.count || 0
      let totalPage = 0

      if (checkout.length === 0) {
        totalPage = 1
      } else {
        if (checkoutCount % limit === 0) {
          totalPage = checkoutCount / limit
        } else {
          totalPage = Math.floor(checkoutCount / limit) + 1
        }
      }

      return res.status(200).json({
        checkout,
        totalData: checkoutCount,
        totalPage
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateWaybill: async(req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { waybill } = req.body

      const checkout = await Checkout.findById(id)
      if (!checkout)
        return res.status(404).json({ msg: `Checkout with ID ${id} not found.` })

      checkout.waybill = waybill
      await checkout.save()

      return res.status(200).json({ msg: `Order with ID ${id} status has been updated successfully.` })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  completeOrder: async(req: IReqUser, res: Response) => {
    try {
      
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default checkoutCtrl