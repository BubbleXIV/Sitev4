import { db } from "../../helpers/db";
import { schema, OutputType } from "./delete_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const { user: requestingUser } = await getServerUserSession(request);
    if (requestingUser.role !== "admin") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    if (requestingUser.id === input.id) {
      return new Response(
        superjson.stringify({ error: "Cannot delete your own account" }),
        { status: 400 }
      );
    }

    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom("sessions").where("userId", "=", input.id).execute();
      await trx
        .deleteFrom("userPasswords")
        .where("userId", "=", input.id)
        .execute();
      const result = await trx
        .deleteFrom("users")
        .where("id", "=", input.id)
        .executeTakeFirst();

      if (result.numDeletedRows === 0n) {
        throw new Error("User not found or could not be deleted.");
      }
    });

    return new Response(
      superjson.stringify({
        success: true,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error deleting admin user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}