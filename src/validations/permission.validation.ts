import { z } from "zod";

export const createPermissionSchema = z.object({
  body: z.object({
    name: z.string("Name is required as string").min(3, 'Name must be at least 3 characters long'),
    key: z.string("Key is required as string").min(3, 'Key must be at least 3 characters long').optional(),
    module: z.string("Module is required as string").min(2, 'Module must be at least 2 characters long'),
    description: z.string("Description is required as string").optional(),
  }),
});

export const updatePermissionSchema = z.object({
  body: z.object({
    name: z.string("Name is required as string").optional(),
    key: z.string("Key is required as string").optional(),
    module: z.string("Module is required as string").optional(),
    description: z.string("Description is required as string").optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
