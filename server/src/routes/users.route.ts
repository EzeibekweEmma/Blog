import express, { Request, Response } from 'express';
import User from '@/models/user.model';
import { EditValidation } from '@/utils/UserValidation';
import { capitalize } from '@/utils/capitalize';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import Authentication from '@/middleware';

const router = express.Router();

router.put('/edit', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, fullName, image, currentPassword, newPassword } = EditValidation.parse(req.body);

    const user = await User.findById((req as any).user.id);
    if (!user) return res.status(404).send('User not found');

    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) return res.status(401).send('Incorrect password');
      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.email = email ? email.toLowerCase().trim() : user.email;
    user.fullName = fullName ? capitalize(fullName) : user.fullName;
    user.image = image;

    await user.save();

    res.status(200).send('User updated successfully');
  } catch (err) {
    // Handle validation error
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

export default router;
