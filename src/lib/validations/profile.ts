import { z } from "zod";

export const profileSchema = z.object({
  fname: z.string().min(1, { message: "First name is required" }),
  lname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().optional(), // It's read-only, we can just optionally validate it if passed
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.password && data.password.length > 0) {
    if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 6,
        type: "string",
        inclusive: true,
        message: "Password must be at least 6 characters long",
        path: ["password"],
      });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  }
});

export type ProfileInput = z.infer<typeof profileSchema>;
