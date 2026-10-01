import { randomBytes } from "crypto";
import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import { supabase } from "./supabase";

export const uploadsDir = path.join(__dirname, "..", "..", "uploads");

const BUCKET = "photos";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const allowedMimeTypes = Object.keys(extensions);

console.log(
  supabase
    ? "Storage: Supabase"
    : "Storage: local ./uploads (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to use Supabase)",
);

// Единственное место, которое знает, где лежат файлы.
// Возвращает то, что хранится в photos.path: полный https url (Supabase) или /uploads/... (локально).
export const saveFile = async (buffer: Buffer, mimetype: string) => {
  const extension = extensions[mimetype];
  if (!extension) throw new Error("Unsupported mime type");

  const name = `${randomBytes(12).toString("hex")}.${extension}`;

  if (supabase) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, buffer, { contentType: mimetype });

    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Storage is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, name), buffer);

  return `/uploads/${name}`;
};

export const removeFile = async (filePath: string) => {
  if (filePath.startsWith("/uploads/")) {
    await rm(path.join(uploadsDir, path.basename(filePath)), { force: true });
    return;
  }

  if (supabase && filePath.includes(`/${BUCKET}/`)) {
    const name = decodeURIComponent(filePath.split(`/${BUCKET}/`).pop() ?? "");
    if (name) await supabase.storage.from(BUCKET).remove([name]);
  }
};
