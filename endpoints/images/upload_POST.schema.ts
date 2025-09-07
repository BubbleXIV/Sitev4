import { z } from "zod";
import superjson from "superjson";
import { type Selectable } from "kysely";
import { type ImageAssets } from "../../helpers/schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileUploadSchema = z.object({
  source: z.literal("upload"),
  file: z
    .instanceof(File, { message: "Image is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      ".jpg, .jpeg, .png, .webp and .gif files are accepted."
    ),
  url: z.string().optional(), // Not used for file upload
  altText: z.string().optional(),
});

const urlUploadSchema = z.object({
  source: z.literal("url"),
  url: z.string().url("Please enter a valid URL."),
  file: z.any().optional(), // Not used for URL upload
  altText: z.string().optional(),
});

export const schema = z.discriminatedUnion("source", [
  fileUploadSchema,
  urlUploadSchema,
]);

export type InputType = z.infer<typeof schema>;

export type ImageAsset = Selectable<ImageAssets>;

export type OutputType = {
  success: boolean;
  image: ImageAsset;
};

export const postUploadImage = async (
  formData: FormData,
  init?: RequestInit
): Promise<OutputType> => {
  // FormData is not stringified
  const result = await fetch(`/_api/images/upload`, {
    method: "POST",
    body: formData,
    ...init,
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
    throw new Error((errorObject as any).error);
  }
  return superjson.parse<OutputType>(await result.text());
};