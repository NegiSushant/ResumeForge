import Link from "next/link";
import ScoreBadge from "./ScoreBadge";

interface AnalysisItem {
  id: string;
  fitScore: number | null;
  fileName: string | null;
  summary: string;
  createdAt: string;
}

interface HistoryTableProps {
  analyses: AnalysisItem[];
}

export default function HistoryTable({ analyses }: HistoryTableProps) {
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-gray-600">
                FileName
              </th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">
                Score
              </th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">
                Summary
              </th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">
                Date
              </th>
              <th className="text-right px-6 py-4 font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {analyses.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-800">
                  {item.fileName || null}
                </td>
                <td className="px-6 py-4">
                  <ScoreBadge score={item.fitScore} />
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-gray-800 line-clamp-2">
                    {item.summary || "No summary available"}
                  </p>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/history/${item.id}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black transition"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
