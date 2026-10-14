export default function ArchitectureFlow() {
  const steps = [
    {
      step: "01",
      badge: "In-Process Parser",
      badgeColor: "bg-orange-50 text-orange-700",
      title: "Document Ingestion",
      description:
        "Upload resumes in PDF or DOCX format. Text is extracted locally using pdfjs-dist and mammoth with zero external network requests.",
      tech: "PDF.js & Mammoth Parser",
    },
    {
      step: "02",
      badge: "Prompt Engineering",
      badgeColor: "bg-blue-50 text-blue-700",
      title: "Recruiter Context Formulation",
      description:
        "Your resume text and target job description are mapped into an expert recruiter prompt requiring strict, validated JSON output.",
      tech: "Deterministic Prompt Engine",
    },
    {
      step: "03",
      badge: "100% Offline AI",
      badgeColor: "bg-purple-50 text-purple-700",
      title: "Docker Model Runner (DMR)",
      description:
        "DMR executes local inference using Google Gemma 3 (4-bit quantized) through an OpenAI-compatible REST API on your local machine.",
      tech: "ai/gemma3:1b · Port 12434",
    },
    {
      step: "04",
      badge: "Precision Output",
      badgeColor: "bg-emerald-50 text-emerald-700",
      title: "Audit & Score Synthesis",
      description:
        "Calculates fit score (0-100), detects matching vs missing skills, identifies keyword gaps, and produces actionable section-by-section edits.",
      tech: "Zod Schema Validation",
    },
  ];

  return (
    <section id="how-it-works" className="mt-16 scroll-mt-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          How the Local Architecture Works
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          A truly private AI pipeline that runs entirely on your workstation
          with zero cloud data leakage.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {steps.map((item) => (
          <div
            key={item.step}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-gray-300 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-mono font-bold text-gray-300">
                  {item.step}
                </span>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Subsystem</span>
              <span className="font-mono font-medium text-gray-700">
                {item.tech}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
