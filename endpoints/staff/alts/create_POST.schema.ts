import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { StaffAlts } from "../../../helpers/schema";

export const schema = z.object({
  staffId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().nullable().optional(),
  pictureUrl: z.string().url("Must be a valid URL").nullable().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  alt: Selectable<StaffAlts>;
};

export const postCreateStaffAlt = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/staff/alts/create`, {
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