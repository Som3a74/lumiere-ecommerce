import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  fname: z.string().min(1, { message: "First name is required" }),
  lname: z.string().min(1, { message: "Last name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  zip: z.string().min(1, { message: "Postal code is required" }),
  card: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(19),
  exp: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: "Invalid expiration date (MM/YY)" }),
  cvc: z.string().min(3, { message: "Invalid CVC" }).max(4),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
