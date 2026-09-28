import Card from "../common/Card";
import { FiFileText } from "react-icons/fi";

const SummaryCard = ({ summary = "", keyPoints = [] }) => {
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
          <FiFileText className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-800">
        {summary ? (
          <p>{summary}</p>
        ) : (
          <span className="text-slate-400 italic">
            Email summary will appear here when generated...
          </span>
        )}

        {keyPoints.length > 0 && (
          <ul className="mt-4 pt-3 border-t border-slate-200 space-y-2">
            {keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default SummaryCard;
