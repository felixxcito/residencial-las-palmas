import { z } from "zod";

/**
 * An empty form field submits as "" (not undefined), which z.coerce.number()
 * turns into 0 — breaking .positive()/.min() checks on optional numeric fields.
 * This normalizes "" to undefined before the inner schema runs.
 */
export function optionalNumber<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    schema.optional()
  );
}
