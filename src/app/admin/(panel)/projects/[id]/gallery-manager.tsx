"use client";

import { ArrowDown, ArrowUp, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { addProjectImages, deleteProjectImage, moveProjectImage, updateProjectImage } from "@/actions/projects";
import { DeleteButton } from "@/components/admin/delete-button";
import { uploadFile } from "@/components/admin/image-upload";

type Img = { id: string; url: string; caption: string | null };

export function ProjectGalleryManager({ projectId, images }: { projectId: string; images: Img[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(undefined);
    const uploaded: { url: string; publicId: string | null }[] = [];
    const list = Array.from(files);
    for (const [i, file] of list.entries()) {
      setUploading(`Uploading ${i + 1} of ${list.length}…`);
      try {
        uploaded.push(await uploadFile(file));
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`);
      }
    }
    if (uploaded.length) {
      setUploading("Saving…");
      await addProjectImages(projectId, uploaded);
    }
    setUploading(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((img, i) => (
          <div key={img.id} className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="relative aspect-[4/3] bg-mist">
              <Image src={img.url} alt={img.caption ?? ""} fill sizes="300px" className="object-cover" />
              <span className="absolute top-2 left-2 rounded-md bg-navy/80 px-2 py-0.5 font-numeric text-xs font-bold text-white">{i + 1}</span>
            </div>
            <div className="space-y-2 p-3">
              <input
                defaultValue={img.caption ?? ""}
                placeholder="Add a caption…"
                onBlur={(e) => {
                  if (e.target.value !== (img.caption ?? "")) startTransition(() => updateProjectImage(img.id, e.target.value));
                }}
                className="field py-2 text-sm"
                aria-label={`Caption for image ${i + 1}`}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button type="button" disabled={i === 0 || pending} onClick={() => startTransition(() => moveProjectImage(img.id, -1))} className="rounded-lg p-2 text-navy hover:bg-mist disabled:opacity-30" aria-label="Move earlier">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" disabled={i === images.length - 1 || pending} onClick={() => startTransition(() => moveProjectImage(img.id, 1))} className="rounded-lg p-2 text-navy hover:bg-mist disabled:opacity-30" aria-label="Move later">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <DeleteButton compact confirmText="Remove?" action={() => deleteProjectImage(img.id)} label="Remove image" />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={!!uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-muted transition hover:border-navy/30 hover:text-navy disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
          <span className="text-sm font-medium">{uploading ?? "Add images"}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
