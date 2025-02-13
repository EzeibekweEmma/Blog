import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '@/models/user.model';
import { LoginValidation } from '../utils/generalValidation';
import { ZodError } from 'zod';
import { generateTokenAndSetCookie } from '@/utils/setCookie';

const router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    let { email, password } = LoginValidation.parse(req.body);

    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Incorrect email or password');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).send('Incorrect email or password');

    generateTokenAndSetCookie(res, user._id.toString(), user.role);

    res.status(200).json({ "message": 'Logged in successfully' });
  } catch (err) {
    if (err instanceof ZodError) {
      console.error('Validation error:', err.errors);
      return res
        .status(400)
        .json({ [err.errors[0].path[0]]: err.errors[0].message });
    }
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ "message": 'Logged out successfully' });
});

export default router;
