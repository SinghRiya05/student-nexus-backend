import { z } from "zod";

/**
 * Simple MongoDB ObjectId validation
 */
const objectIdSchema = z
  .string()
  .min(1, "ID is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

/**
 * Create University Schema
 */
export const createUniversitySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "University name is required"),

    domain: z
      .string()
      .min(1, "Domain is required"),

    country: objectIdSchema,
  }),
});

/**
 * Update University Schema
 */
export const updateUniversitySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "University name cannot be empty")
      .optional(),

    domain: z
      .string()
      .min(1, "Domain cannot be empty")
      .optional(),

    country: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid country ID")
      .optional(),
  }),
});

/**
 * Get University By ID
 */
export const getUniversityByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * Delete University
 */
export const deleteUniversitySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});