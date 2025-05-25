
import z from 'zod';

export const registerSchema = z.object({
    employeeName : z.string().min(1, "Employee name is required"),
    age: z.number().min(18 ,"Age must be 18 or above"),
    role: z.string().optional().default("Software Developer"),
    address: z.string().min(1,"Address is required"),
    email: z.string().email("Invalid email format").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }),
    password : z.string().min(5,"Password must be 5 character long")
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email format").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }),
    password : z.string().min(5,"Password must be 5 character long")
})

export const updateEmployeeSchema = z.object({
     employeeName : z.string().min(1, "Employee name is required").optional(),
    age: z.number().min(18 ,"Age must be 18 or above").optional(),
    role: z.string().optional().default("Software Developer").optional(),
    address: z.string().min(1,"Address is required").optional(),
    email: z.string().email("Invalid email format").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }).optional(),
    password : z.string().min(5,"Password must be 5 character long").optional()
})

export const resetPasswordlinkSchema = z.object({
      email: z.string().email("Invalid email format").min(1, "Email  is required").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }),
})

export const resetPasswordSchema = z.object({
    password : z.string().min(5,"Password must be 5 character long"),
    token: z.string().min(1, "Token is required"),
})
export const verifyTokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
    email: z.string().email("Invalid email format").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }),
})
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export  type updateEmployeeInput = z.infer<typeof updateEmployeeSchema>