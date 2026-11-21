"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export async function uploadFile(file: File): Promise<{ url: string; publicId: string }> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error ?? "Upload failed");
  return { url: data.url, publicId: data.publicId };
}

/**
 * Uploads an image immediately and writes its URL + public id into hidden inputs,
 * so it submits with the surrounding form. A URL can also be pasted directly.
 */
export function ImageUpload({
  name,
  idName,
  label,
  defaultUrl,
  defaultId,
  error,
  aspect = "aspect-[16/10]",
  required,
}: {
  name: string;
  idName: string;
  label: string;
  defaultUrl?: string | null;
  defaultId?: string | null;
  error?: string;
  aspect?: string;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [publicId, setPublicId] = useState(defaultId ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setUploadError(undefined);
    try {
      const result = await uploadFile(file);
      setUrl(result.url);
      setPublicId(result.publicId);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input type="hidden" name={name} value={url} />
      <input type="hidden" name={idName} value={publicId} />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed bg-mist transition",
          aspect,
          error || uploadError ? "border-red-300" : "border-line hover:border-navy/30",
        )}
      >
        {url ? (
          <>
            <Image src={url} alt="" fill sizes="600px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-mist">
                <Upload className="h-3.5 w-3.5" /> Replace
              </button>
              <button type="button" onClick={() => { setUrl(""); setPublicId(""); }} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted hover:text-navy">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm font-medium">Click or drop an image</span>
            <span className="text-xs">JPG, PNG, WebP · max 8 MB</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-navy" />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <details className="mt-2 text-xs text-muted">
        <summary className="cursor-pointer select-none hover:text-navy">Or paste an image URL</summary>
        {/* Plain text, not type="url": uploaded images have relative paths (/uploads/…), which the
            browser would reject as invalid and silently block the whole form from submitting. */}
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setPublicId(""); }}
          placeholder="https://images.unsplash.com/…"
          className="field mt-2 py-2 text-sm"
        />
      </details>
      {(error || uploadError) && <p className="mt-1.5 text-sm text-red-600">{uploadError ?? error}</p>}
    </div>
  );
}
