import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type MenuItems } from "../../helpers/schema";

export const schema = z.object({
  categoryId: z.number().optional(),
});

export type InputType = z.infer<typeof schema>;

export type MenuItem = Selectable<MenuItems>;

export type OutputType = {
  items: MenuItem[];
};

export const getGetMenuItems = async (
  params: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const searchParams = new URLSearchParams();
  if (params.categoryId) {
    searchParams.append("categoryId", params.categoryId.toString());
  }

  const result = await fetch(`/_api/menu/items?${searchParams.toString()}`, {
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