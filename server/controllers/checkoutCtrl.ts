import { Request, Response } from 'express'
import { IReqUser } from './../utils/interface'

const checkoutCtrl = {
  create: async(req: IReqUser, res: Response) => {
    try {
      
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