import { promises as fs } from "fs";
import mammoth from "mammoth";

async function extractFromPdf(filePath: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await fs.readFile(filePath));

  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    verbosity: 0,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");

    fullText += pageText + "\n\n";
  }

  return fullText.trim();
}

// Extract text from a DOCX file
async function extractFromDocx(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value.trim();
}

//Main function – detects file type and extracts text
export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractFromPdf(filePath);
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractFromDocx(filePath);
  }
  throw new Error("Unsupported file type for text extraction");
}
