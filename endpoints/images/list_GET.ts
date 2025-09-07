import { db } from "../../helpers/db";
import { OutputType } from "./list_GET.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    const images = await db
      .selectFrom("imageAssets")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();

    return new Response(
      superjson.stringify({
        images,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error listing images:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}