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

    const users = await db
      .selectFrom("users")
      .selectAll()
      .where("role", "=", "admin")
      .orderBy("createdAt", "desc")
      .execute();

    return new Response(
      superjson.stringify({
        users,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error listing admin users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}