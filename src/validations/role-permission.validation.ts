import { z } from "zod";

export const createRolePermissionSchema = z.object({
  body: z.object({
    role: z.string().min(1, "Role ID is required"),
    permissions: z.array(z.string()).min(1, "At least one permission is required"),
  }),
});

export const updateRolePermissionSchema = z.object({
  body: z.object({
    permissions: z.array(z.string()).min(1, "At least one permission is required"),
  }),
  params: z.object({
    roleId: z.string().min(1, "Role ID is required"),
  }),
});