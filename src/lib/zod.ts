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

export const UpatedEmployeeSchema = registerSchema.partial();

export const loginSchema = z.object({
    email: z.string().email("Invalid email format").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }),
    password : z.string().min(5,"Password must be 5 character long")
})


export const resetPasswordLink = z.object({
    email: z.string().email("Invalid email format").refine((value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),{
        message : "Email is not valid"
    }) 
})

export const resetPassword = z.object({
    newPassword : z.string().min(5,"Password must be required"),
    confirmPassword : z.string().min(5,"Password must be required")
})

