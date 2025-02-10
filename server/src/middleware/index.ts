import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@/config'
import { keyFunc, TokenPayload } from '@/utils/types';

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

const Authentication = (req: Request, res: Response, next: NextFunction): any => {
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
};

export default Authentication;
