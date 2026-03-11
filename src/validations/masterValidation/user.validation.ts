import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createUserSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50)
      .trim(),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50)
      .trim(),

    email: z
      .string()
      .email("Invalid email")
      .toLowerCase(),

    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .max(15),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    universityId: objectIdSchema,
    courseId: objectIdSchema,
    semesterId: objectIdSchema,
    roleId: objectIdSchema,

    verificationStatus: z
      .boolean()
      .optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE"])
      .optional(),

    is_deleted: z
      .boolean()
      .optional()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),

  body: z.object({
    firstName: z
      .string()
      .min(2)
      .max(50)
      .trim()
      .optional(),

    lastName: z
      .string()
      .min(2)
      .max(50)
      .trim()
      .optional(),

    email: z
      .string()
      .email()
      .optional(),

    phone: z
      .string()
      .min(10)
      .max(15)
      .optional(),

    password: z
      .string()
      .min(6)
      .optional(),

    universityId: objectIdSchema.optional(),
    courseId: objectIdSchema.optional(),
    semesterId: objectIdSchema.optional(),
    roleId: objectIdSchema.optional(),

    verificationStatus: z
      .boolean()
      .optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE"])
      .optional(),

    is_deleted: z
      .boolean()
      .optional()
  })
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});