import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  fname: z.string().min(1, { message: "First name is required" }),
  lname: z.string().min(1, { message: "Last name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().length(2, { message: "Use 2-letter country code (e.g. US, EG)" }).toUpperCase(),
  postalCode: z.string().min(1, { message: "Postal Code is required" }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
