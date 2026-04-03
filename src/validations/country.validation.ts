import z from "zod";


export const createCountrySchema = z.object({
  body: z.object({
    name: z.string("Country name should be a string"),

    code: z
      .string("Country code should be a string")
      .min(1, "Country code is required"),
  }),
});

export const updateCountrySchema = z.object({
  body: z.object({
    name: z.string("Country name should be a string").optional(),

    code: z.string("Country code should be a string").min(1, "Country code is required").optional(),
  })
});

