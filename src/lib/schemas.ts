import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5 MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only PDF and DOCX files are allowed",
    }),
});

export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;

export const jdTextSchema = z.object({
  text: z
    .string()
    .min(50, "Job description is too short (minimum 50 characters)")
    .max(20000, "Job description is too long (maximum 20,000 characters)"),
});

export const jdFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5 MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only PDF and DOCX files are allowed",
    }),
});

export const analyzeSchema = z
  .object({
    resumeId: z.string().min(1, "Invalid resumeId"),
    jdId: z.string().min(1, "Invalid jdId").optional(),
    jdText: z.string().min(50, "Job description is too short (minimum 50 characters)").max(20000).optional(),
  })
  .refine((data) => data.jdId || data.jdText, {
    message: "Either jdId or jdText must be provided",
    path: ["jdId"],
  });

export const analysisResultSchema = z.object({
  fitScore: z.number().min(0).max(100),
  scoreExplanation: z.string(),
  summary: z.string(),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestedImprovements: z.array(
    z.object({
      section: z.string(),
      suggestion: z.string(),
    })
  ),
  keywordGaps: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

