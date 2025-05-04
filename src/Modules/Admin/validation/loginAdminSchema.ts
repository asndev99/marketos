import { z } from "zod";
import { baseStringSchema, passwordSchema } from "./common";

export const loginAdminSchema = z
  .object({
    username: baseStringSchema,
    password: passwordSchema,
  })
  .strict();
