import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type UploadResult = { url: string; publicId: string };

// Magic-byte check so a renamed non-image can't slip through on MIME type alone.
function looksLikeImage(buf: Buffer) {
  const hex = buf.subarray(0, 12).toString("hex");
  return (
    hex.startsWith("ffd8ff") || // jpeg
    hex.startsWith("89504e47") || // png
    (hex.startsWith("52494646") && buf.subarray(8, 12).toString() === "WEBP") ||
    buf.subarray(4, 12).toString().startsWith("ftypavi")
  );
}

export async function uploadImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error("Only JPG, PNG, WebP or AVIF images are allowed");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image must be 8 MB or smaller");

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(buffer)) throw new Error("File is not a valid image");

  if (useCloudinary) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: process.env.CLOUDINARY_FOLDER || "hh-constructions", resource_type: "image" },
          (error, result) => {
            if (error || !result) return reject(error ?? new Error("Upload failed"));
            resolve({ url: result.secure_url, publicId: result.public_id });
          },
        )
        .end(buffer);
    });
  }

  // Development fallback: store on local disk under /public/uploads.
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return { url: `/uploads/${name}`, publicId: `local:${name}` };
}

export async function deleteImage(publicId: string | null | undefined) {
  if (!publicId) return;
  try {
    if (publicId.startsWith("local:")) {
      const name = path.basename(publicId.slice(6));
      await unlink(path.join(process.cwd(), "public", "uploads", name));
    } else if (useCloudinary) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.warn("[upload] Could not delete image", publicId, error);
  }
}
