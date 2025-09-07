import { db } from "../../../helpers/db";
import { schema, OutputType } from "./delete_POST.schema";
import { getServerUserSession } from "../../../helpers/getServerUserSession";
import superjson from 'superjson';
import { NotAuthenticatedError } from "../../../helpers/getSetServerSession";
import { z } from "zod";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== 'admin') {
      throw new NotAuthenticatedError("Admin privileges required.");
    }

    const json = superjson.parse(await request.text());
    const { id } = schema.parse(json);

    const result = await db.deleteFrom('staffAlts')
      .where('id', '=', id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      throw new Error("Staff alt not found.");
    }

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error) {
    console.error("Error deleting staff alt:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = error instanceof NotAuthenticatedError ? 401 : error instanceof z.ZodError ? 400 : 500;
    return new Response(superjson.stringify({ error: errorMessage }), { status });
  }
}