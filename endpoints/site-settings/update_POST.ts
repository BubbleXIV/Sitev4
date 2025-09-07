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
    const settingsToUpdate = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      for (const [key, value] of Object.entries(settingsToUpdate)) {
        await trx.insertInto('siteSettings')
          .values({ key, value })
          .onConflict((oc) => oc
            .column('key')
            .doUpdateSet({ value })
          )
          .execute();
      }
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error) {
    console.error("Error updating site settings:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = error instanceof NotAuthenticatedError ? 401 : error instanceof z.ZodError ? 400 : 500;
    return new Response(superjson.stringify({ error: errorMessage }), { status });
  }
}