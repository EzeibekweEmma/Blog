import config from '@/config'
import { keyFunc } from '@/utils/types'
import { Response } from 'express'
import jwt from 'jsonwebtoken'


export const generateTokenAndSetCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId, keyFunc: keyFunc.AUTH }, config.app.JWT_SECRET!, {
    expiresIn: '7d',
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.environment === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}