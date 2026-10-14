import { NextRequest, NextResponse } from "next/server";
import { jdTextSchema, jdFileSchema } from "@/lib/schemas";
import { saveJobDescription } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // ---------- Case A: JSON body (plain text) ----------
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const validation = jdTextSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const { jdId, metadata } = await saveJobDescription({
        text: validation.data.text,
      });

      return NextResponse.json(
        {
          success: true,
          jdId,
          text: metadata.text,
          characterCount: metadata.characterCount,
          type: "text",
        },
        { status: 201 },
      );
    }

    // ---------- Case B: form-data (file upload) ----------
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 },
        );
      }

      const validation = jdFileSchema.safeParse({ file });

      if (!validation.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }

      const { jdId, metadata } = await saveJobDescription({
        file: validation.data.file,
      });

      return NextResponse.json(
        {
          success: true,
          jdId,
          text: metadata.text,
          characterCount: metadata.characterCount,
          originalName: metadata.originalName,
          extractionError: metadata.extractionError,
          type: "file",
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Unsupported Content-Type. Use application/json or multipart/form-data",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("JD upload error:", error);
    return NextResponse.json(
      { error: "Failed to process job description" },
      { status: 500 },
    );
  }
}
