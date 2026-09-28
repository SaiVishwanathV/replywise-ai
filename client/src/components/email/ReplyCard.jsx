import { FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";

const ReplyCard = ({ reply = "", tone = "Professional", onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Card className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Generated Reply
        </h3>
        <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {tone}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-800 min-h-[140px] whitespace-pre-wrap">
        {reply || (
          <span className="text-slate-400 italic">
            Your AI-generated reply will appear here...
          </span>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!reply}>
          {copied ? <FiCheck className="h-4 w-4 text-emerald-600" /> : <FiCopy className="h-4 w-4 text-slate-600" />}
          {copied ? "Copied!" : "Copy Reply"}
        </Button>
      </div>
    </Card>
  );
};

export default ReplyCard;
