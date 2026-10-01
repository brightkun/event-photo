// Функции Vercel принимают тело запроса до 4.5 МБ, поэтому фото с камеры телефона
// уменьшаем и пережимаем в jpeg. Маленькие файлы уходят как есть.
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;
const MAX_BYTES = 3.5 * 1024 * 1024;

// от лучшего качества к более лёгкому
const ATTEMPTS = [
  { maxSide: 2048, quality: 0.85 },
  { maxSide: 1600, quality: 0.75 },
  { maxSide: 1200, quality: 0.7 },
];

export interface IPreparedImage {
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

const encode = async (
  bitmap: ImageBitmap,
  maxSide: number,
  quality: number,
) => {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );

  return blob ? { blob, width, height } : null;
};

export const prepareImage = async (file: File): Promise<IPreparedImage> => {
  try {
    const bitmap = await createImageBitmap(file);

    if (
      file.size <= SKIP_BELOW_BYTES &&
      Math.max(bitmap.width, bitmap.height) <= ATTEMPTS[0]!.maxSide
    ) {
      const original = { blob: file, name: file.name };
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return { ...original, ...size };
    }

    let result: Awaited<ReturnType<typeof encode>> = null;

    for (const { maxSide, quality } of ATTEMPTS) {
      result = await encode(bitmap, maxSide, quality);
      if (result && result.blob.size <= MAX_BYTES) break;
    }

    bitmap.close();

    if (!result) throw new Error("Could not encode image");

    return { ...result, name: "photo.jpg" };
  } catch {
    return { blob: file, name: file.name, width: 1000, height: 1000 };
  }
};
