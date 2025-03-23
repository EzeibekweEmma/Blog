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

export const PostValidation = z.object({
  title: z.string().min(5, 'Title must be at least 5 character(s) long').max(100, 'Title should not exceed 100 character(s)'),
  description: z.string().min(50, 'Description must be at least 50 character(s) long').max(200, 'Description should not exceed 200 character(s)'),
  image: z.string().url(),
  content: z.string().min(20, 'Content must be at least 20 character(s) long'),
  categories: z.array(z.string()).default(['general']),
  isFeatured: z.boolean().optional().nullable(),
  isPublished: z.boolean().optional().nullable()
})

export const EditPostValidation = z.object({
  title: z.string().min(5, 'Title must be at least 5 character(s) long').max(100, 'Title should not exceed 100 character(s)').nullable().optional(),
  description: z.string().min(50, 'Description must be at least 50 character(s) long').max(200, 'Description should not exceed 200 character(s)').nullable().optional(),
  image: z.string().url().nullable().optional(),
  content: z.string().min(20, 'Content must be at least 20 character(s) long').nullable().optional(),
  categories: z.array(z.string()).nullable().optional(),
  isFeatured: z.boolean().optional().nullable(),
  isPublished: z.boolean().optional().nullable()
})

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpe', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
export const fileSchema = z.object({
  fieldname: z.literal('file'),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine(
    (type) => ALLOWED_MIME_TYPES.includes(type),
    { message: 'Invalid file type' }
  ),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number().positive()
})
