import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import { validEmail, validPassword } from '../utils/validator'
import { generateToken } from '../utils/generateToken'
import jwt, { decode } from 'jsonwebtoken'
import { IDecodedToken } from '../utils/interface'

const userCtrl = {
  register: async(req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body
      if (!name || !email || !password)
        return res.status(400).json({ msg: 'Please provide required field for registration purpose.' })

      if (!validEmail(email))
        return res.status(400).json({ msg: 'Please provide valid email address for registration purpose.' })

      if (password.length < 8)
        return res.status(400).json({ msg: 'Password should be at least 8 characters.' })
      else if (!validPassword(password))
        return res.status(400).json({ msg: 'Password should be combination of lowercase, uppercase, number, and symbol.' })
      
      const user = await User.findOne({ email })
      if (user)
        return res.status(400).json({ msg: `${email} has been registered to our system.` })

      const passwordHash = await bcrypt.hash(password, 12)
      
      const newUser = new User({
        name,
        email,
        password: passwordHash
      })
      await newUser.save()

      return res.status(200).json({
        msg: `${email} has been registerd successfully at our system.`
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  login: async(req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      
      if (!email || !password)
        return res.status(400).json({ msg: 'Please provide required field for login purpose.' })

      if (!validEmail)
        return res.status(400).json({ msg: 'Please provide valid email address for login purpose.' })

      const user = await User.findOne({ email })
      if (!user)
        return res.status(401).json({ msg: 'Invalid credential.' })

      const checkPassword = await bcrypt.compare(password, user.password)
      if (!checkPassword)
        return res.status(401).json({ msg: 'Invalid credential.' })

      const accessToken = generateToken({ id: user._id }, 'accessToken')
      const refreshToken = generateToken({ id: user._id }, 'refreshToken')

      res.cookie('osc', refreshToken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 30 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({
        msg: `Authenticated as ${user.name}`,
        accessToken,
        user: {
          ...user._doc,
          password: ''
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  logout: async(req: Request, res: Response) => {
    try {
      res.clearCookie('osc', {
        path: '/user/refresh_token'
      })

      return res.status(200).json({ msg: 'Logout success.' })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  refreshToken: async(req: Request, res: Response) => {
    try {
      const { osc: token } = req.cookies

      if (!token)
        return res.status(401).json({ msg: 'Invalid credential.' })

      const decoded = <IDecodedToken>jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`)
      if (!decoded.id)
        return res.status(401).json({ msg: 'Invalid credential.' })

      const user = await User.findById(decoded.id)
      if (!user)
        return res.status(401).json({ msg: 'Invalid credential.' })

      const accessToken = generateToken({ id: user._id }, 'accessToken')
      const refreshToken = generateToken({ id: user._id }, 'refreshToken')

      res.cookie('osc', {
        path: '/user/refresh_token',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({
        accessToken,
        user: {
          ...user._doc,
          password: ''
        }
      })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default userCtrl