import config from '@/config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

interface TokenPayload {
  userId: string
  keyFunc?: string
}

const keyFunc = {
  AUTH: 'Authentication',
  RESET_PASSWORD: 'Reset Password',
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized - no token provided' })
  try {
    const decoded = jwt.verify(token, config.app.JWT_SECRET!)

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized - invalid token' })
    const { userId, keyFunc: func } = decoded as TokenPayload

    if (func !== keyFunc.AUTH)
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized - invalid token' })

    req.userId = userId
    return next()
  } catch (error) {
    console.log('Error in verifyToken ', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const generateTokenAndSetCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, config.app.JWT_SECRET!, {
    expiresIn: '7d',
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.environment === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}
