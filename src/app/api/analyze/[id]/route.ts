import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAnalysisById } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
        { error: "Analysis ID is required" },
        { status: 400 },
      );
    }

    const analysis = await getAnalysisById(id, session.user.id);

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      ...analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 },
    );
  }
}
