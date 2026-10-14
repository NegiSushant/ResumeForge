import { NextRequest, NextResponse } from "next/server";
import { resumeUploadSchema } from "@/lib/schemas";
import { saveResumeFile } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // Basic check before Zod
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate with Zod
    const validation = resumeUploadSchema.safeParse({ file });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Save to local disk
    const { resumeId, metadata } = await saveResumeFile(validation.data.file);

    return NextResponse.json(
      {
        success: true,
        resumeId,
        // metadata,
        originalName: metadata.originalName,
        extractedText: metadata.extractedText,
        extractionError: metadata.extractionError,
        characterCount: metadata.extractedText.length,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 },
    );
  }
}
