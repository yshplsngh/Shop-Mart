import jwt from 'jsonwebtoken'

export const generateToken = (payload: object, type: string) => {
  if (type === 'accessToken')
    return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '1h' })
  else if (type === 'refreshToken')
    return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '30d' })
}