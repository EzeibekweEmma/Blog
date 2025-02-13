import { z } from 'zod'

export const LoginValidation = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 character(s) long')
})

export const EditValidation = z.object({
  fullName: z
    .string()
    .min(3, 'Name must be at least 3 character(s) long')
    .max(50, 'Name should not exceed 50 character(s)').optional().nullable(),
  email: z.string().email().trim().toLowerCase().optional().nullable(),
  image: z.string().url().optional().nullable(),
  currentPassword: z.string().min(8, 'Current password must be at least 8 characters long').optional().nullable(),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/, 'Password must include at least one special character')
    .optional().nullable(),
  confirmPassword: z.string().optional().nullable()
})
  .refine(
    (data) => !data.newPassword || data.currentPassword,
    {
      message: 'Current password is required when updating the new password',
      path: ['currentPassword']
    }
  )
  .refine(
    (data) => !(data.newPassword && data.newPassword === data.currentPassword),
    {
      message: 'New password must be different from the current password',
      path: ['newPassword']
    }
  )
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword']
    }
  )

export const BlogPostValidation = z.object({
  title: z.string().min(3, 'Title must be at least 3 character(s) long').max(100, 'Title should not exceed 100 character(s)'),
  description: z.string().min(3, 'Description must be at least 3 character(s) long').max(200, 'Description should not exceed 200 character(s)'),
  image: z.string().regex(
    /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/,
    'Invalid Base64 image format'
  ),
  content: z.string().min(20, 'Content must be at least 20 character(s) long'),
  category: z.array(z.string()).default(['general']),
  isFeatured: z.boolean().optional().nullable(),
  isPublished: z.boolean().optional().nullable()
})
