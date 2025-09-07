import { db } from "../../helpers/db";
import { schema, OutputType } from "./create_POST.schema";
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

    const existingUser = await db
      .selectFrom("users")
      .select("id")
      .where("email", "=", input.email)
      .executeTakeFirst();

    if (existingUser) {
      return new Response(
        superjson.stringify({ error: "User with this email already exists" }),
        { status: 409 }
      );
    }

    const passwordHash = await generatePasswordHash(input.password);

    const newUser = await db.transaction().execute(async (trx) => {
      const user = await trx
        .insertInto("users")
        .values({
          email: input.email,
          displayName: input.displayName,
          username: input.username,
          role: "admin",
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("userPasswords")
        .values({
          userId: user.id,
          passwordHash: passwordHash,
        })
        .execute();

      return user;
    });

    return new Response(
      superjson.stringify({
        success: true,
        user: newUser,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}