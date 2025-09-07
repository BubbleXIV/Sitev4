import { db } from "../../helpers/db";
import { schema, OutputType } from "./update_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { generatePasswordHash } from "../../helpers/generatePasswordHash";
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

    const { id, password, ...userData } = input;

    const updatedUser = await db.transaction().execute(async (trx) => {
      const user = await trx
        .updateTable("users")
        .set(userData)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();

      if (password) {
        const passwordHash = await generatePasswordHash(password);
        await trx
          .updateTable("userPasswords")
          .set({ passwordHash, createdAt: new Date() })
          .where("userId", "=", id)
          .execute();
      }

      return user;
    });

    return new Response(
      superjson.stringify({
        success: true,
        user: updatedUser,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error updating admin user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}