import { db } from "../../helpers/db";
import { schema, OutputType } from "./upload_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";
// In a real app, you would use a library like @aws-sdk/client-s3 to upload to a cloud storage provider.
// For this example, we will simulate the upload and assume a public URL is generated.
// This is NOT a production-ready implementation for file storage.
import { nanoid } from "nanoid";

async function uploadFileToStorage(
  file: File
): Promise<{ url: string; filename: string }> {
  // This is a placeholder. In a real application, you would upload the file
  // to a service like AWS S3, Google Cloud Storage, or Cloudflare R2 and get a public URL.
  console.log(`Simulating upload for file: ${file.name}`);
  const extension = file.name.split(".").pop() || "";
  const filename = `${nanoid()}.${extension}`;
  const url = `/uploads/${filename}`; // This path would need to be served by a static file server.
  console.log(`File would be available at: ${url}`);
  return { url, filename };
}

export async function handle(request: Request): Promise<Response> {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    const formData = await request.formData();
    const result = schema.parse(formData);

    let imageUrl: string;
    let filename: string;
    let mimeType: string | null = null;
    let sizeBytes: number | null = null;

    if (result.source === "upload" && result.file) {
      const uploadedFile = await uploadFileToStorage(result.file);
      imageUrl = uploadedFile.url;
      filename = uploadedFile.filename;
      mimeType = result.file.type;
      sizeBytes = result.file.size;
    } else if (result.source === "url" && result.url) {
      // In a real app, you might want to fetch the image from the URL,
      // validate it, and re-upload it to your own storage to prevent hotlinking
      // and ensure availability. For now, we'll just use the provided URL.
      imageUrl = result.url;
      filename = result.url.substring(result.url.lastIndexOf("/") + 1);
    } else {
      throw new Error("Invalid upload source provided.");
    }

    const newImage = await db
      .insertInto("imageAssets")
      .values({
        url: imageUrl,
        filename,
        altText: result.altText,
        mimeType,
        sizeBytes,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(
      superjson.stringify({
        success: true,
        image: newImage,
      } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
}