import { z } from "zod";
import superjson from 'superjson';

export const schema = z.record(z.string(), z.string().nullable());

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  success: boolean;
};

export const postUpdateSiteSettings = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/site-settings/update`, {
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