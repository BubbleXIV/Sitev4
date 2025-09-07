import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type Pages } from "../../helpers/schema";

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and contain only letters, numbers, and hyphens"
    ),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().optional(),
  content: z.string().nullable().optional(),
});

export type InputType = z.infer<typeof schema>;

export type Page = Selectable<Pages>;

export type OutputType = {
  success: boolean;
  page: Page;
};

export const postCreatePage = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/pages/create`, {
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