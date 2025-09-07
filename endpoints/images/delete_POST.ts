import { db } from "../../helpers/db";
import { schema, OutputType } from "./delete_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";

export async function handle(request: Request): Promise<Response> {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // In a real app, you would also delete the file from your storage provider (e.g., S3).
    // const image = await db.selectFrom('imageAssets').select('filename').where('id', '=', input.id).executeTakeFirst();
    // if (image) { await deleteFileFromStorage(image.filename); }

    const result = await db
      .deleteFrom("imageAssets")
      .where("id", "=", input.id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      throw new Error("Image not found or could not be deleted.");
    }

    return new Response(
      superjson.stringify({
        success: true,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}