import JSZip from "jszip";
import { api } from "../lib/axios";

/**
 * Gets the backend proxy URL for an image
 */
export function getPhotoProxyUrl(imageUrl: string, download = false, filename?: string): string {
  const baseURL = api.defaults.baseURL || "http://localhost:4000/api";
  let url = `${baseURL}/photos/proxy?url=${encodeURIComponent(imageUrl)}`;
  if (download) {
    url += `&download=true&filename=${encodeURIComponent(filename || "foto.jpg")}`;
  }
  return url;
}

/**
 * Safely resolves an image display URL (routes R2 images through backend proxy to prevent SSL/HSTS errors)
 */
export function getPhotoDisplayUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")) return imageUrl;
  return getPhotoProxyUrl(imageUrl, false);
}

/**
 * Downloads a single file blob to client browser
 */
export function triggerFileDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Fetches an image URL safely as ArrayBuffer (direct fetch or proxy fallback)
 */
export async function fetchImageArrayBuffer(url: string): Promise<ArrayBuffer> {
  // 1. Try direct fetch first
  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.arrayBuffer();
    }
  } catch (err) {
    console.warn("Direct fetch for ZIP failed, switching to backend proxy...", err);
  }

  // 2. Try proxy endpoint via plain fetch (bypassing axios credentials CORS restriction)
  const proxyUrl = getPhotoProxyUrl(url);
  const res = await fetch(proxyUrl);
  if (!res.ok) {
    throw new Error(`Proxy status error: ${res.status}`);
  }
  return await res.arrayBuffer();
}

/**
 * Downloads a single original photo directly (forces browser download attachment)
 */
export async function downloadOriginalPhoto(imageUrl: string, fileName: string) {
  const downloadUrl = getPhotoProxyUrl(imageUrl, true, fileName);
  
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Bundles multiple original photos into a ZIP archive and triggers browser download
 */
export async function downloadPhotosAsZip({
  photos,
  zipFileName,
  onProgress,
}: {
  photos: { id: string; photo_url: string; caption?: string | null; created_at?: string }[];
  zipFileName: string;
  onProgress?: (current: number, total: number) => void;
}) {
  const zip = new JSZip();
  const folder = zip.folder("Photos") || zip;
  const total = photos.length;
  let successCount = 0;

  for (let i = 0; i < total; i++) {
    const photo = photos[i];
    onProgress?.(i + 1, total);

    const ext = photo.photo_url.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `foto_${i + 1}_${photo.id.slice(0, 6)}.${ext}`;

    try {
      const buffer = await fetchImageArrayBuffer(photo.photo_url);
      folder.file(fileName, buffer);
      successCount++;
    } catch (err) {
      console.error(`Gagal memproses foto ${photo.id} (${photo.photo_url}) untuk zip:`, err);
    }
  }

  if (successCount === 0) {
    throw new Error("Tidak ada file foto yang berhasil diunduh ke dalam paket ZIP.");
  }

  const zipContent = await zip.generateAsync({ type: "blob" });
  triggerFileDownload(zipContent, `${zipFileName}.zip`);
}
