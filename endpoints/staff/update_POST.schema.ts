import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Staff } from "../../helpers/schema";

export const schema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required").optional(),
  role: z.string().min(1, "Role is required").optional(),
  bio: z.string().nullable().optional(),
  pictureUrl: z.string().url("Must be a valid URL").nullable().optional(),
  displayOrder: z.number().int().positive().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  staff: Selectable<Staff>;
};

export const postUpdateStaff = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/staff/update`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
    throw new Error((errorObject as any).error);
  }
  return superjson.parse<OutputType>(await result.text());
};