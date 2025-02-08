import { generateTokenAndSetCookie } from '@/middleware'
import User from '@/models/user.model'
import bcryptjs from 'bcryptjs'
import { Request, Response } from 'express'

export const loginService = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: 'Incorrect email or password' })
      return
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      res
        .status(400)
        .json({ success: false, message: 'Incorrect email or password' })
      return
    }

    generateTokenAndSetCookie(res, user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
    })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: (error as Error).message })
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}
