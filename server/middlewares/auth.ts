import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { IDecodedToken, IReqUser } from '../utils/interface'
import User from '../models/User'

export const isAuthenticated = async(req: IReqUser, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')
    if (!token)
      return res.status(403).json({ msg: 'Access forbidden.' })

    const decoded = <IDecodedToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    if (!decoded.id)
      return res.status(403).json({ msg: 'Access forbidden.' })
    
    const user = await User.findById(decoded.id)
    if (!user)
      return res.status(403).json({ msg: 'Access forbidden.' })

    req.user = user
    next()
  } catch (err: any) {
    return res.status(500).json({ msg: err.message })
  }
}

export const authorizeRoles = (...roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return res.status(403).json({ msg: 'Access forbidden.' })
    }

    next()
  }
}