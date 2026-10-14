interface ScoreBadgeProps {
  score: number | null;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === null) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        —
      </span>
    );
  }

  let colorClass = "bg-red-50 text-red-700";
  if (score >= 70) colorClass = "bg-emerald-50 text-emerald-700";
  else if (score >= 40) colorClass = "bg-orange-50 text-orange-700";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {score}/100
    </span>
  );
}
