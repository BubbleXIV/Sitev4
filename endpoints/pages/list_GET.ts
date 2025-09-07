import { db } from "../../helpers/db";
import { OutputType } from "./list_GET.schema";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const pages = await db
      .selectFrom("pages")
      .selectAll()
      .orderBy("displayOrder", "asc")
      .execute();

    return new Response(
      superjson.stringify({
        pages,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error listing pages:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}