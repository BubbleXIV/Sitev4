import { db } from "../../helpers/db";
import { OutputType } from "./categories_GET.schema";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const categories = await db
      .selectFrom("menuCategories")
      .selectAll()
      .orderBy("displayOrder", "asc")
      .execute();

    const items = await db
      .selectFrom("menuItems")
      .selectAll()
      .orderBy("displayOrder", "asc")
      .execute();

    const categoriesWithItems = categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    }));

    return new Response(
      superjson.stringify({
        categories: categoriesWithItems,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}