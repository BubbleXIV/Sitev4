import { db } from "../../helpers/db";
import { schema, OutputType } from "./items_GET.schema";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    const input = schema.parse({
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
    });

    let query = db.selectFrom("menuItems").selectAll();

    if (input.categoryId) {
      query = query.where("categoryId", "=", input.categoryId);
    }

    const items = await query.orderBy("displayOrder", "asc").execute();

    return new Response(
      superjson.stringify({
        items,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error fetching menu items:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}