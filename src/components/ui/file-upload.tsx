"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import {
  Upload,
  X,
  CheckCircle,
  Image as ImageIcon,
  Star,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { PhotoItem } from "@/types"

interface FileUploadProps {
  onUpload: (url: string, thumbUrl: string) => void
  photos: PhotoItem[]
  onPhotosChange: (photos: PhotoItem[]) => void
  maxFiles?: number
  accept?: Record<string, string[]>
}

export function FileUpload({
  onUpload,
  photos,
  onPhotosChange,
  maxFiles = 5,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<
    { file: File; preview: string }[]
  >([])
  const { t } = useI18n()
  const [error, setError] = useState("")
  const dragItemRef = useRef<number | null>(null)
  const dragOverRef = useRef<number | null>(null)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      setError("")
      const remaining = maxFiles - photos.length
      if (accepted.length > remaining) {
        setError(`You can upload max ${maxFiles} files`)
        return
      }

      const newFiles = accepted.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setUploadingFiles((prev) => [...prev, ...newFiles])

    const hasPrimary = photos.some((p) => p.isPrimary)

    for (const f of accepted) {
      const formData = new FormData()
      formData.append("file", f)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (res.ok) {
          setUploadingFiles((prev) =>
            prev.filter((pf) => pf.file !== f),
          )
          const newItem: PhotoItem = {
            url: data.url,
            thumbUrl: data.thumbUrl,
            isPrimary: !hasPrimary && photos.length === 0,
          }
          onPhotosChange([...photos, newItem])
          onUpload(data.url, data.thumbUrl)
        } else {
          setError(data.error || "Upload failed")
          setUploadingFiles((prev) => prev.filter((pf) => pf.file !== f))
        }
      } catch {
        setError("Upload failed")
        setUploadingFiles((prev) => prev.filter((pf) => pf.file !== f))
      }
    }
    },
    [maxFiles, photos, onPhotosChange, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles,
    disabled: photos.length + uploadingFiles.length >= maxFiles,
  })

  const setPrimary = (url: string) => {
    onPhotosChange(
      photos.map((p) => ({ ...p, isPrimary: p.url === url })),
    )
  }

  const moveUp = (index: number) => {
    if (index <= 0) return
    const updated = [...photos]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onPhotosChange(updated)
  }

  const moveDown = (index: number) => {
    if (index >= photos.length - 1) return
    const updated = [...photos]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onPhotosChange(updated)
  }

  const removePhoto = (index: number) => {
    const removed = photos[index]
    const updated = photos.filter((_, i) => i !== index)
    // If the removed photo was primary, promote the first remaining
    if (removed.isPrimary && updated.length > 0) {
      updated[0] = { ...updated[0], isPrimary: true }
    }
    onPhotosChange(updated)
  }

  // ── Drag-and-drop reorder ──
  const handleDragStart = (index: number) => {
    dragItemRef.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverRef.current = index
  }

  const handleDragEnd = () => {
    const from = dragItemRef.current
    const to = dragOverRef.current
    if (from !== null && to !== null && from !== to) {
      const updated = [...photos]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      onPhotosChange(updated)
    }
    dragItemRef.current = null
    dragOverRef.current = null
  }

  const allItems = photos.length + uploadingFiles.length

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-[#8f4e00] bg-[#8f4e00]/5"
            : allItems >= maxFiles
              ? "border-gray-200 bg-gray-50 opacity-50"
              : "border-[#E4E2E1] hover:border-[#8f4e00] hover:bg-[#8f4e00]/5"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#8f4e00]/10">
          <Upload className="h-6 w-6 text-[#8f4e00]" />
        </div>
        {isDragActive ? (
          <p className="font-medium text-[#8f4e00]">{t("profile.dropActive")}</p>
        ) : (
          <>
            <p className="font-semibold text-[#1b1c1c]">
              {t("profile.dropPhotos")}
            </p>
            <p className="mt-1 text-xs text-[#887364]">
              {t("profile.photoFormats")}
            </p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {/* Already-uploaded photos */}
          {photos.map((photo, i) => (
            <div
              key={photo.url}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#E4E2E1] bg-[#ffdcc2] transition-shadow hover:shadow-md"
            >
              <img
                src={photo.thumbUrl || photo.url}
                alt={`Photo ${i + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Primary badge */}
              <button
                type="button"
                onClick={() => setPrimary(photo.url)}
                title={
                  photo.isPrimary
                    ? "Primary photo"
                    : "Set as primary photo"
                }
                className={`absolute left-1 top-1 rounded-full p-1 transition-all ${
                  photo.isPrimary
                    ? "bg-[#8f4e00] text-white shadow-md"
                    : "bg-black/40 text-white/70 opacity-0 group-hover:opacity-100"
                }`}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    photo.isPrimary ? "fill-current" : ""
                  }`}
                />
              </button>

              {/* Reorder buttons */}
              <div className="absolute bottom-1 left-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    className="rounded bg-black/50 p-0.5 text-white hover:bg-black/70"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                )}
                {i < photos.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    className="rounded bg-black/50 p-0.5 text-white hover:bg-black/70"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Drag handle */}
              <div className="absolute bottom-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-3.5 w-3.5 text-white drop-shadow-md" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Primary label */}
              {photo.isPrimary && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                    <Star className="h-2.5 w-2.5 fill-[#8f4e00] text-[#8f4e00]" />
                    Primary
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Currently uploading placeholders */}
          {uploadingFiles.map((f, i) => (
            <div
              key={f.preview}
              className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#E4E2E1] bg-[#ffdcc2]"
            >
              <img
                src={f.preview}
                alt="Uploading"
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state hint */}
      {photos.length === 0 && uploadingFiles.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <ImageIcon className="h-10 w-10 text-[#E4E2E1]" />
          <p className="text-sm text-[#887364]">
            {t("profile.noPhotosGallery")}
          </p>
        </div>
      )}
    </div>
  )
}
