import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type PageContent } from "../../helpers/schema";

export const pageContentItemSchema = z.object({
  sectionKey: z.string(),
  contentType: z.string(),
  content: z.string().nullable(),
});

export const schema = z.object({
  pageSlug: z.string(),
  content: z.array(pageContentItemSchema),
});

export type InputType = z.infer<typeof schema>;

export type PageContentItem = Selectable<PageContent>;

export type OutputType = {
  success: boolean;
  pageContent: PageContentItem[];
};

export const postUpdatePageContent = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/page-content/update`, {
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