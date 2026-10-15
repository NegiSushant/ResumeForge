import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getResumeFile } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const fileRecord = await getResumeFile(id, session.user.id);
    if (!fileRecord || !fileRecord.buffer) {
      return NextResponse.json(
        { error: "Resume file not found" },
        { status: 404 }
      );
    }

    const mimeType = fileRecord.mimeType || "application/pdf";
    const fileName = fileRecord.fileName || "resume.pdf";

    // Convert Buffer to Uint8Array for NextResponse body
    const uint8Array = new Uint8Array(fileRecord.buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": uint8Array.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve resume file:", error);
    return NextResponse.json(
      { error: "Failed to serve resume file" },
      { status: 500 }
    );
  }
}
