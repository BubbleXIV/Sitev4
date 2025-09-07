import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type PageContent } from "../../helpers/schema";

export const schema = z.object({
  pageSlug: z.string(),
});

export type InputType = z.infer<typeof schema>;

export type PageContentItem = Selectable<PageContent>;

export type OutputType = {
  pageContent: PageContentItem[];
};

export const getGetPageContent = async (
  params: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const searchParams = new URLSearchParams();
  searchParams.append("pageSlug", params.pageSlug);

  const result = await fetch(`/_api/page-content/get?${searchParams.toString()}`, {
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