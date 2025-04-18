import config from '../config'
import { keyFunc } from '../utils/types'
import { Response } from 'express'
import jwt from 'jsonwebtoken'


/**
 * Generate a JWT token and set it as a cookie
 * @param res - Response object
 * @param userId - User ID
 * @param userRole - User role
 * @returns void
 */
export const generateTokenAndSetCookie = (res: Response, userId: string, userRole: string) => {
  const token = jwt.sign({ userId, userRole, keyFunc: keyFunc.AUTH }, config.app.JWT_SECRET!, {
    expiresIn: '7d',
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.environment !== 'development',
    sameSite: config.app.environment !== 'development' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}