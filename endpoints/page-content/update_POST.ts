import { db } from "../../helpers/db";
import { schema, OutputType } from "./update_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Unauthorized" }),
        { status: 403 }
      );
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      // Delete existing content for the page slug
      await trx
        .deleteFrom("pageContent")
        .where("pageSlug", "=", input.pageSlug)
        .execute();

      if (input.content.length > 0) {
        // Insert new content
        const contentToInsert = input.content.map((item, index) => ({
          pageSlug: input.pageSlug,
          sectionKey: item.sectionKey,
          contentType: item.contentType,
          content: item.content,
          displayOrder: index,
        }));

        await trx
          .insertInto("pageContent")
          .values(contentToInsert)
          .execute();
      }
    });

    const updatedPageContent = await db
      .selectFrom("pageContent")
      .selectAll()
      .where("pageSlug", "=", input.pageSlug)
      .orderBy("displayOrder", "asc")
      .execute();

    return new Response(
      superjson.stringify({
        success: true,
        pageContent: updatedPageContent,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error updating page content:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}