import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type MenuCategories, type MenuItems } from "../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type MenuItem = Selectable<MenuItems>;
export type MenuCategory = Selectable<MenuCategories> & {
  items: MenuItem[];
};

export type OutputType = {
  categories: MenuCategory[];
};

export const getGetMenuCategories = async (
  params: InputType = {},
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/menu/categories`, {
    method: "GET",
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