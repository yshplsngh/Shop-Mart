import { Request } from 'express'

export const pagination = (req: Request, defaultLimit: number = 9) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || defaultLimit
  const skip = (page - 1) * limit
  return { page, limit, skip }
}