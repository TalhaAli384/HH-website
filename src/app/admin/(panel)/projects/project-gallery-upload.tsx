"use client";

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { uploadFile } from "@/components/admin/image-upload";
import { maxProjectGalleryImages } from "@/config/site";

type GalleryImage = { url: string; publicId: string; caption: string };

export function ProjectGalleryUpload({ onUploadingChange }: { onUploadingChange: (uploading: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState<string>();
  const [error, setError] = useState<string>();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(undefined);
    const selected = Array.from(files);
    if (images.length + selected.length > maxProjectGalleryImages) {
      setError(`A project can have up to ${maxProjectGalleryImages} gallery images.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const uploaded: GalleryImage[] = [];
    onUploadingChange(true);
    try {
      for (const [index, file] of selected.entries()) {
        setUploading(`Uploading ${index + 1} of ${selected.length}…`);
        try {
          const image = await uploadFile(file);
          uploaded.push({ ...image, caption: "" });
        } catch (uploadError) {
          setError(`${file.name}: ${uploadError instanceof Error ? uploadError.message : "Upload failed"}`);
        }
      }
      setImages((current) => [...current, ...uploaded]);
    } finally {
      setUploading(undefined);
      onUploadingChange(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  };

  return (
    <div>
      <input type="hidden" name="galleryImages" value={JSON.stringify(images)} />
      {images.length > 0 && (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={`${image.publicId}-${index}`} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="relative aspect-[4/3] bg-mist">
                <Image src={image.url} alt={image.caption || `Project gallery image ${index + 1}`} fill sizes="300px" className="object-cover" />
                <span className="absolute top-2 left-2 rounded-md bg-navy/80 px-2 py-0.5 font-numeric text-xs font-bold text-white">{index + 1}</span>
              </div>
              <div className="space-y-2 p-3">
                <input
                  value={image.caption}
                  maxLength={200}
                  onChange={(event) => {
                    const caption = event.target.value;
                    setImages((current) => current.map((item, i) => (i === index ? { ...item, caption } : item)));
                  }}
                  placeholder="Add a caption…"
                  className="field py-2 text-sm"
                  aria-label={`Caption for image ${index + 1}`}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)} className="rounded-lg p-2 text-navy hover:bg-mist disabled:opacity-30" aria-label="Move image earlier">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} className="rounded-lg p-2 text-navy hover:bg-mist disabled:opacity-30" aria-label="Move image later">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Remove image ${index + 1}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!!uploading}
        className="flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-muted transition hover:border-navy/30 hover:text-navy disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
        <span className="text-sm font-medium">{uploading ?? "Add gallery images"}</span>
        <span className="text-xs">JPG, PNG, WebP or AVIF · up to {maxProjectGalleryImages} images</span>
      </button>
      <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(event) => handleFiles(event.target.files)} />
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
