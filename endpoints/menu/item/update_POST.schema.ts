import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type MenuItems } from "../../../helpers/schema";

export const schema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  priceGil: z.number().int().positive("Price must be a positive number"),
  imageUrl: z.string().url("Must be a valid URL").nullable().optional(),
  categoryId: z.number(),
  displayOrder: z.number().optional(),
});

export type InputType = z.infer<typeof schema>;

export type MenuItem = Selectable<MenuItems>;

export type OutputType = {
  success: boolean;
  item: MenuItem;
};

export const postUpdateMenuItem = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/menu/item/update`, {
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