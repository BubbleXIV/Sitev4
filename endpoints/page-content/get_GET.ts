import { db } from "../../helpers/db";
import { schema, OutputType } from "./get_GET.schema";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const pageSlug = url.searchParams.get("pageSlug");

    const input = schema.parse({ pageSlug });

    const pageContent = await db
      .selectFrom("pageContent")
      .selectAll()
      .where("pageSlug", "=", input.pageSlug)
      .orderBy("displayOrder", "asc")
      .execute();

    return new Response(
      superjson.stringify({
        pageContent,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error fetching page content:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}