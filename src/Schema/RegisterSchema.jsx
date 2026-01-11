import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[#?!@$%^&*-]/, 'Password must contain at least one special character (#?!@$%^&*-)'),
  rePassword: z.string(),
  dateOfBirth: z.coerce.date().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select a gender')
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ['rePassword']
})