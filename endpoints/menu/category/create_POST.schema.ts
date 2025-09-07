import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type MenuCategories } from "../../../helpers/schema";

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  displayOrder: z.number().optional(),
});

export type InputType = z.infer<typeof schema>;

export type MenuCategory = Selectable<MenuCategories>;

export type OutputType = {
  success: boolean;
  category: MenuCategory;
};

export const postCreateMenuCategory = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/menu/category/create`, {
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