import { db } from "../../../helpers/db";
import { schema, OutputType } from "./create_POST.schema";
import { getServerUserSession } from "../../../helpers/getServerUserSession";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newCategory = await db
      .insertInto("menuCategories")
      .values({
        name: input.name,
        displayOrder: input.displayOrder,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(
      superjson.stringify({
        success: true,
        category: newCategory,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error creating menu category:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}