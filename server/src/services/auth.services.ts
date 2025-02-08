import { generateTokenAndSetCookie } from '@/middleware';
import User from '@/models/user.model'
import bcryptjs from 'bcryptjs'
import { Request, Response } from 'express';

export async function loginService(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect email or password' })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect email or password' })
    }

    generateTokenAndSetCookie(res, user.id)

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message })
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
