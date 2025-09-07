import { z } from "zod";
import { db } from "../../helpers/db";
import { schema, OutputType } from "./create_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from 'superjson';
import { NotAuthenticatedError } from "../../helpers/getSetServerSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== 'admin') {
      throw new NotAuthenticatedError("Admin privileges required.");
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newStaffMember = await db.transaction().execute(async (trx) => {
      const maxOrderResult = await trx.selectFrom('staff')
        .select(db.fn.max('displayOrder').as('maxOrder'))
        .executeTakeFirst();
      
      const nextDisplayOrder = (maxOrderResult?.maxOrder ?? 0) + 1;

      return await trx.insertInto('staff')
        .values({
          ...input,
          displayOrder: nextDisplayOrder,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });

    return new Response(superjson.stringify({ staff: newStaffMember } satisfies OutputType));
  } catch (error) {
    console.error("Error creating staff member:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = error instanceof NotAuthenticatedError ? 401 : error instanceof z.ZodError ? 400 : 500;
    return new Response(superjson.stringify({ error: errorMessage }), { status });
  }
}