import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

const PHOTO_DIR = join(process.cwd(), "public/uploads/photos")
const DOC_DIR = join(process.cwd(), "public/uploads/documents")
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const ALLOWED_DOC_TYPES = ["application/pdf"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const fileType = (formData.get("type") as string) || "image"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (fileType === "document") {
      // Handle biodata document (PDF)
      if (!ALLOWED_DOC_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Only PDF files allowed for documents" }, { status: 400 })
      }

      await mkdir(DOC_DIR, { recursive: true })

      const filename = `${randomUUID()}.pdf`
      const filepath = join(DOC_DIR, filename)
      await writeFile(filepath, buffer)

      const url = `/uploads/documents/${filename}`
      return NextResponse.json({ url, filename, type: "document" })
    }

    // Handle image upload
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP allowed for photos" }, { status: 400 })
    }

    await mkdir(PHOTO_DIR, { recursive: true })

    const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp"
    const filename = `${randomUUID()}.${ext}`
    const filepath = join(PHOTO_DIR, filename)

    const optimized = await sharp(buffer)
      .resize(800, 1000, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer()

    await writeFile(filepath, optimized)

    const url = `/uploads/photos/${filename}`

    const thumbnailName = `thumb_${filename}`
    const thumbPath = join(PHOTO_DIR, thumbnailName)

    const thumbnail = await sharp(buffer)
      .resize(200, 250, { fit: "cover" })
      .jpeg({ quality: 60 })
      .toBuffer()

    await writeFile(thumbPath, thumbnail)

    const thumbUrl = `/uploads/photos/${thumbnailName}`

    return NextResponse.json({ url, thumbUrl, filename, type: "image" })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
