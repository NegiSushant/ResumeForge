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
    resumeId: z.string().uuid("Invalid resumeId"),
    jdId: z.string().uuid("Invalid jdId").optional(),
    jdText: z.string().min(50).max(20000).optional(),
  })
  .refine((data) => data.jdId || data.jdText, {
    message: "Either jdId or jdText must be provided",
    path: ["jdId"],
  });
