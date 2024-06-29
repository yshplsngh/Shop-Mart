import { Request, Response } from 'express'
import { IReqUser } from './../utils/interface'
import { checkArrayEquality } from '../utils/helper'
import Checkout from '../models/Checkout'
import { validEmail, validPhoneNumber } from '../utils/validator'
import * as Buffer from 'buffer'
import User from '../models/User'

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
      
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateWaybill: async(req: Request, res: Response) => {
    try {
      
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