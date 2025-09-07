import { db } from "../../../helpers/db";
import { schema, OutputType } from "./create_POST.schema";
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
    const input = schema.parse(json);

    const newAlt = await db.transaction().execute(async (trx) => {
      const maxOrderResult = await trx.selectFrom('staffAlts')
        .where('staffId', '=', input.staffId)
        .select(db.fn.max('displayOrder').as('maxOrder'))
        .executeTakeFirst();
      
      const nextDisplayOrder = (maxOrderResult?.maxOrder ?? 0) + 1;

      return await trx.insertInto('staffAlts')
        .values({
          ...input,
          displayOrder: nextDisplayOrder,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });

    return new Response(superjson.stringify({ alt: newAlt } satisfies OutputType));
  } catch (error) {
    console.error("Error creating staff alt:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = error instanceof NotAuthenticatedError ? 401 : error instanceof z.ZodError ? 400 : 500;
    return new Response(superjson.stringify({ error: errorMessage }), { status });
  }
}