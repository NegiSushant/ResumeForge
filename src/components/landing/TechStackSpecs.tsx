export default function TechStackSpecs() {
  const specs = [
    {
      title: "Docker Model Runner",
      tag: "Local Inference",
      detail:
        "Standardized container executing models locally with OpenAI-compatible chat endpoints.",
    },
    {
      title: "Google Gemma 3",
      tag: "1B-Q4_K_M",
      detail:
        "High-efficiency open-weight model tuned for structured JSON extraction and resume assessment.",
    },
    {
      title: "Next.js 16 + Turbopack",
      tag: "App Router",
      detail:
        "Modern SSR architecture with Partial Prerendering (PPR) and zero client telemetry.",
    },
    {
      title: "Local File Isolation",
      tag: "PDF & DOCX",
      detail:
        "In-process buffer parsing using PDF.js and Mammoth. Clean storage in local filesystem.",
    },
  ];

  return (
    <section className="mt-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Engineered for Performance & Privacy
        </h2>
        <p className="mt-2 text-gray-600 text-sm max-w-xl mx-auto">
          Built with an enterprise-grade local stack that guarantees reliability
          and speed.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map((spec) => (
          <div
            key={spec.title}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                {spec.tag}
              </span>
              <h3 className="font-semibold text-gray-900 text-sm mt-3 mb-1.5">
                {spec.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {spec.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
