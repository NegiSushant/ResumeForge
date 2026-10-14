import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { extractTextFromFile } from "./extract-text";

const UPLOAD_DIR = path.join(process.cwd(), "data", "resumes");
const JD_DIR = path.join(process.cwd(), "data", "job-descriptions");
const ANALYSIS_DIR = path.join(process.cwd(), "data", "analyses");

export async function ensureAnalysisDir() {
  await fs.mkdir(ANALYSIS_DIR, { recursive: true });
}

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function ensureJdDir() {
  await fs.mkdir(JD_DIR, { recursive: true });
}

export async function saveResumeFile(file: File) {
  await ensureUploadDir();

  const resumeId = uuidv4();
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeFileName = `${resumeId}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, safeFileName);

  // 1. Save original file
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // 2. Extract text
  let extractedText = "";
  let extractionError: string | null = null;

  try {
    extractedText = await extractTextFromFile(filePath, file.type);
  } catch (err) {
    console.error("Text extraction failed:", err);
    extractionError =
      err instanceof Error ? err.message : "Unknown extraction error";
  }

  // 3. Save metadata (now includes extracted text)
  const metadata = {
    id: resumeId,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    savedAt: new Date().toISOString(),
    fileName: safeFileName,
    extractedText, // ← the important part
    extractionError, // null if successful
  };

  const metadataPath = path.join(UPLOAD_DIR, `${resumeId}.json`);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  return {
    resumeId,
    filePath,
    metadata,
  };
}

export async function saveJobDescription(options: {
  text?: string;
  file?: File;
}) {
  await ensureJdDir();

  const jdId = uuidv4();
  let finalText = "";
  let originalName: string | null = null;
  let mimeType: string | null = null;
  let fileName: string | null = null;
  let extractionError: string | null = null;

  // Case 1: Text was provided directly
  if (options.text) {
    finalText = options.text.trim();
  }

  // Case 2: File was uploaded
  if (options.file) {
    const extension =
      options.file.name.split(".").pop()?.toLowerCase() || "bin";
    fileName = `${jdId}.${extension}`;
    const filePath = path.join(JD_DIR, fileName);

    const buffer = Buffer.from(await options.file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    originalName = options.file.name;
    mimeType = options.file.type;

    try {
      finalText = await extractTextFromFile(filePath, options.file.type);
    } catch (err) {
      extractionError =
        err instanceof Error ? err.message : "Unknown extraction error";
    }
  }

  if (!finalText && !extractionError) {
    throw new Error("No valid job description content found");
  }

  const metadata = {
    id: jdId,
    type: options.file ? "file" : "text",
    originalName,
    mimeType,
    fileName,
    text: finalText,
    characterCount: finalText.length,
    extractionError,
    savedAt: new Date().toISOString(),
  };

  const metadataPath = path.join(JD_DIR, `${jdId}.json`);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  return {
    jdId,
    metadata,
  };
}

export async function getResumeById(resumeId: string) {
  const metadataPath = path.join(
    process.cwd(),
    "data",
    "resumes",
    `${resumeId}.json`,
  );

  try {
    const raw = await fs.readFile(metadataPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.log(`Error: ${err}`);
    return null;
  }
}

export async function getJobDescriptionById(jdId: string) {
  const metadataPath = path.join(
    process.cwd(),
    "data",
    "job-descriptions",
    `${jdId}.json`,
  );

  try {
    const raw = await fs.readFile(metadataPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveAnalysis(options: {
  resumeId: string;
  jdId?: string | null;
  resume: string | null;
  analysis: any;
  model: string;
}) {
  await ensureAnalysisDir();

  const analysisId = uuidv4();

  const record = {
    id: analysisId,
    resumeId: options.resumeId,
    resume: options.resume,
    jdId: options.jdId || null,
    analysis: options.analysis,
    model: options.model,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(ANALYSIS_DIR, `${analysisId}.json`);
  await fs.writeFile(filePath, JSON.stringify(record, null, 2));

  return record;
}

export async function getAnalysisById(analysisId: string) {
  const filePath = path.join(ANALYSIS_DIR, `${analysisId}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
export async function getAllAnalysis() {
  try {
    // await fs.mkdir(ANALYSIS_DIR, { recursive: true });

    const files = await fs.readdir(ANALYSIS_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const analyses = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(ANALYSIS_DIR, file);
        const raw = await fs.readFile(filePath, "utf-8");
        return JSON.parse(raw);
      }),
    );
    return analyses;
  } catch {
    return null;
  }
}
