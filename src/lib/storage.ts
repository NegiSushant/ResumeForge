import { promises as fs } from "fs";
import path from "path";
import os from "os";
import mongoose from "mongoose";
import { extractTextFromFile } from "./extract-text";
import { connectToDatabase } from "./mongodb";
import Resume from "@/models/Resume";
import JobDescription from "@/models/JobDescription";
import Analysis from "@/models/Analysis";

export async function saveResumeFile(file: File, userId: string) {
  await connectToDatabase();

  // 1. Temporary write to extract text
  const tempDir = os.tmpdir();
  const tempFileName = `upload_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const tempFilePath = path.join(tempDir, tempFileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(tempFilePath, buffer);

  // 2. Extract text
  let extractedText = "";
  let extractionError: string | null = null;

  try {
    extractedText = await extractTextFromFile(tempFilePath, file.type);
  } catch (err) {
    console.error("Text extraction failed:", err);
    extractionError =
      err instanceof Error ? err.message : "Unknown extraction error";
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore unlink errors
    }
  }

  // 3. Save to MongoDB
  const resume = await Resume.create({
    userId: new mongoose.Types.ObjectId(userId),
    originalName: file.name,
    mimeType: file.type,
    extractedText: extractedText || "",
    fileData: buffer,
  });

  return {
    resumeId: resume._id.toString(),
    metadata: {
      id: resume._id.toString(),
      originalName: resume.originalName,
      mimeType: resume.mimeType,
      extractedText: resume.extractedText,
      extractionError,
      savedAt: resume.createdAt.toISOString(),
    },
  };
}

export async function getResumeFile(resumeId: string, userId?: string) {
  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return null;
  }

  const query: Record<string, unknown> = { _id: resumeId };
  if (userId) {
    query.userId = new mongoose.Types.ObjectId(userId);
  }

  const resume = await Resume.findOne(query);
  if (!resume || !resume.fileData) {
    return null;
  }

  return {
    buffer: resume.fileData,
    mimeType: resume.mimeType,
    fileName: resume.originalName,
  };
}

export async function getResumeById(resumeId: string, userId?: string) {
  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return null;
  }

  const query: Record<string, unknown> = { _id: resumeId };
  if (userId) {
    query.userId = new mongoose.Types.ObjectId(userId);
  }

  const resume = await Resume.findOne(query);
  if (!resume) return null;

  return {
    id: resume._id.toString(),
    userId: resume.userId.toString(),
    originalName: resume.originalName,
    mimeType: resume.mimeType,
    extractedText: resume.extractedText,
    createdAt: resume.createdAt.toISOString(),
  };
}

export async function saveJobDescription(
  options: {
    text?: string;
    file?: File;
  },
  userId: string
) {
  await connectToDatabase();

  let finalText = "";
  let originalName: string | null = null;
  let mimeType: string | null = null;
  let extractionError: string | null = null;

  // Case 1: Plain text provided
  if (options.text) {
    finalText = options.text.trim();
  }

  // Case 2: File uploaded
  if (options.file) {
    const tempDir = os.tmpdir();
    const tempFileName = `jd_${Date.now()}_${options.file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    const buffer = Buffer.from(await options.file.arrayBuffer());
    await fs.writeFile(tempFilePath, buffer);

    originalName = options.file.name;
    mimeType = options.file.type;

    try {
      finalText = await extractTextFromFile(tempFilePath, options.file.type);
    } catch (err) {
      extractionError =
        err instanceof Error ? err.message : "Unknown extraction error";
    } finally {
      try {
        await fs.unlink(tempFilePath);
      } catch {
        // Ignore unlink error
      }
    }
  }

  if (!finalText && !extractionError) {
    throw new Error("No valid job description content found");
  }

  const jd = await JobDescription.create({
    userId: new mongoose.Types.ObjectId(userId),
    text: finalText,
  });

  return {
    jdId: jd._id.toString(),
    metadata: {
      id: jd._id.toString(),
      originalName,
      mimeType,
      text: finalText,
      characterCount: finalText.length,
      extractionError,
      savedAt: jd.createdAt.toISOString(),
    },
  };
}

export async function getJobDescriptionById(jdId: string, userId?: string) {
  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(jdId)) {
    return null;
  }

  const query: Record<string, unknown> = { _id: jdId };
  if (userId) {
    query.userId = new mongoose.Types.ObjectId(userId);
  }

  const jd = await JobDescription.findOne(query);
  if (!jd) return null;

  return {
    id: jd._id.toString(),
    userId: jd.userId.toString(),
    text: jd.text,
    createdAt: jd.createdAt.toISOString(),
  };
}

export async function saveAnalysis(options: {
  userId: string;
  resumeId: string;
  jdId?: string | null;
  resume: string | null;
  jobDescription?: string;
  resumeText?: string;
  analysis: any;
  model: string;
}) {
  await connectToDatabase();

  const fitScore =
    typeof options.analysis?.fitScore === "number"
      ? options.analysis.fitScore
      : 0;

  const record = await Analysis.create({
    userId: new mongoose.Types.ObjectId(options.userId),
    resumeId: options.resumeId,
    resumename: options.resume || "",
    jdId: options.jdId || null,
    jobDescription: options.jobDescription || "",
    analysis: options.analysis,
    fitScore,
    model: options.model,
  });

  return {
    id: record._id ? record._id.toString() : "",
    resumeId: record.resumeId,
    resume: record.resumename,
    resumeText: options.resumeText || "",
    jobDescription: record.jobDescription || "",
    jdId: record.jdId,
    analysis: record.analysis,
    fitScore: record.fitScore,
    model: record.model,
    createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function getAnalysisById(analysisId: string, userId?: string) {
  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(analysisId)) {
    return null;
  }

  const query: Record<string, unknown> = { _id: analysisId };
  if (userId) {
    query.userId = new mongoose.Types.ObjectId(userId);
  }

  const item: any = await Analysis.findOne(query);
  if (!item) return null;

  let resumeText = "";
  let resumeMimeType = "";
  let hasResumeFile = false;
  if (item.resumeId && mongoose.Types.ObjectId.isValid(item.resumeId.toString())) {
    try {
      const resumeDoc = await Resume.findById(item.resumeId);
      if (resumeDoc) {
        resumeText = resumeDoc.extractedText || "";
        resumeMimeType = resumeDoc.mimeType || "";
        hasResumeFile = Boolean(resumeDoc.fileData);
      }
    } catch (e) {
      console.error("Failed to load resume text:", e);
    }
  }

  let jobDescription = item.jobDescription || "";
  if (!jobDescription && item.jdId && mongoose.Types.ObjectId.isValid(item.jdId.toString())) {
    try {
      const jdDoc = await JobDescription.findById(item.jdId);
      if (jdDoc) {
        jobDescription = jdDoc.text || "";
      }
    } catch (e) {
      console.error("Failed to load jd text:", e);
    }
  }

  return {
    id: item._id ? item._id.toString() : "",
    userId: item.userId?.toString(),
    resumeId: item.resumeId?.toString(),
    resumeUrl: item.resumeId ? `/api/resumes/${item.resumeId}/file` : undefined,
    resumeMimeType,
    hasResumeFile,
    fileName: item.resumename,
    resumeText,
    jobDescription,
    jdId: item.jdId?.toString() || null,
    analysis: item.analysis,
    fitScore: item.fitScore,
    model: item.model,
    createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function getAllAnalysis(userId: string) {
  await connectToDatabase();

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }

  const records = await Analysis.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 });

  return records.map((item: any) => ({
    id: item._id ? item._id.toString() : "",
    resumeId: item.resumeId?.toString(),
    fileName: item.resumename,
    jdId: item.jdId?.toString() || null,
    fitScore: item.analysis?.fitScore ?? item.fitScore ?? null,
    summary: item.analysis?.summary ?? "",
    model: item.model,
    createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
  }));
}
