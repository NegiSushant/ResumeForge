"use client";

interface ResumeUploadProps {
  resumeFile: File | null;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResumeUpload({
  resumeFile,
  isUploading,
  onUpload,
}: ResumeUploadProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        1. Upload Resume (PDF or DOCX)
      </label>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={onUpload}
          className="hidden"
          id="resume-upload"
          disabled={isUploading}
        />
        <label htmlFor="resume-upload" className="cursor-pointer block">
          {isUploading ? (
            <p className="text-gray-500">Uploading & extracting text...</p>
          ) : resumeFile ? (
            <div>
              <p className="font-medium text-gray-900">{resumeFile.name}</p>
              <p className="text-sm text-emerald-600 mt-1">✓ Ready</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">
                PDF or DOCX • Max 5MB
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
