import z from "zod";
import { STATUS } from "../../config";

export const countrySchema = z.object({
  body: z.object({
    name: z
      .string("Country name should be a string"),
    image: z.string("Image should be a string").optional(),
    code: z
      .string("Country code should be a string")
      .min(1, "Country code is required")
      .max(3, "Country code must be at most 3 characters long"),
    currency: z
      .string("Currency should be a string")
      .min(3, "Currency must be at least 3 characters long"),
    status: z
      .enum([STATUS.ACTIVE, STATUS.INACTIVE], "Status must be either 'active' or 'inactive'"),
  }),
});
