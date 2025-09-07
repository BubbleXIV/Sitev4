import { db } from "../../helpers/db";
import { schema, OutputType } from "./update_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from 'superjson';
import { NotAuthenticatedError } from "../../helpers/getSetServerSession";
import { z } from "zod";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== 'admin') {
      throw new NotAuthenticatedError("Admin privileges required.");
    }

    const json = superjson.parse(await request.text());
    const { id, ...updateData } = schema.parse(json);

    const updatedStaff = await db.updateTable('staff')
      .set(updateData)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ staff: updatedStaff } satisfies OutputType));
  } catch (error) {
    console.error("Error updating staff member:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = error instanceof NotAuthenticatedError ? 401 : error instanceof z.ZodError ? 400 : 500;
    return new Response(superjson.stringify({ error: errorMessage }), { status });
  }
}