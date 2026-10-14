export default function PrivacyComparison() {
  const comparisons = [
    {
      feature: "Data Destination",
      cloud: "Sent over the internet to remote 3rd-party servers",
      local: "Never leaves your local machine (100% localhost)",
      highlight: true,
    },
    {
      feature: "PII & Contact Info",
      cloud: "Phone, email, home address, and employers uploaded",
      local: "Stored locally on your disk; 0 cloud exposure",
      highlight: true,
    },
    {
      feature: "AI Inference Engine",
      cloud: "Proprietary cloud APIs (OpenAI, Anthropic, etc.)",
      local: "Open-weight Gemma 3 via Docker Model Runner",
      highlight: false,
    },
    {
      feature: "Pricing & Subscriptions",
      cloud: "Often $15 - $30/month subscriptions & paywalls",
      local: "Completely free, open-source, and unlimited",
      highlight: true,
    },
    {
      feature: "Offline Availability",
      cloud: "Requires constant high-speed internet connection",
      local: "Runs entirely offline once the model image is pulled",
      highlight: false,
    },
  ];

  return (
    <section className="mt-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Why Local AI Beats Cloud Resume Builders
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          Your career history, contact details, and current compensation are
          private. Keep them on your device.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-50/80 border-b border-gray-100 p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
          <div className="hidden md:block">Privacy Factor</div>
          <div className="text-red-600 font-bold">Cloud Resume Services</div>
          <div className="text-emerald-700 font-bold">ResumeForge (Local)</div>
        </div>

        <div className="divide-y divide-gray-100 text-sm">
          {comparisons.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-3 p-4 sm:p-5 gap-2 md:gap-4 items-center ${
                row.highlight ? "bg-orange-50/20" : ""
              }`}
            >
              <div className="font-medium text-gray-900 md:text-gray-800">
                {row.feature}
              </div>
              <div className="text-gray-600 flex items-start gap-2">
                <span className="text-red-500 shrink-0">✕</span>
                <span>{row.cloud}</span>
              </div>
              <div className="text-gray-900 font-medium flex items-start gap-2">
                <span className="text-emerald-600 shrink-0 font-bold">✓</span>
                <span>{row.local}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
