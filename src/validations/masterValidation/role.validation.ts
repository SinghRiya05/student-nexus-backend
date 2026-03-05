import z from "zod";
import { STATUS } from "../../config";

export const createRoleSchema = z.object({
  body: z.object({
    name: z
      .string("Name should be a string")
      .min(2, "Role name must be at least 2 characters long"),

    description: z
      .string("Description should be a string")
      .optional(),

    status: z.enum(
      [STATUS.ACTIVE, STATUS.INACTIVE],
      "Status must be either 'ACTIVE' or 'INACTIVE'"
    ).optional(),
  }),
});


export const getRoleSchema = z.object({
  params: z.object({
    id: z.string("Role id should be a string"),
  }),
});


export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string("Role id should be a string"),
  }),

  body: z.object({
    name: z
      .string("Name should be a string")
      .min(2, "Role name must be at least 2 characters long")
      .optional(),

    description: z
      .string("Description should be a string")
      .optional(),

    status: z
      .enum([STATUS.ACTIVE, STATUS.INACTIVE], "Status must be either 'ACTIVE' or 'INACTIVE'")
      .optional(),
  }),
});

export const deleteRoleSchema = z.object({
  params: z.object({
    id: z.string("Role id should be a string"),
  }),
});