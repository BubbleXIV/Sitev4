import { db } from "../../helpers/db";
import { OutputType } from "./get_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const settings = await db.selectFrom('siteSettings')
      .selectAll()
      .execute();

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string | null>);

    return new Response(superjson.stringify({ settings: settingsMap } satisfies OutputType));
  } catch (error) {
    console.error("Error fetching site settings:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}