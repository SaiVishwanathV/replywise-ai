import { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiTrash2,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMail,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import { getHistoryApi, deleteHistoryApi } from "../services/history";

const TONES = [
  "All",
  "Professional",
  "Formal",
  "Friendly",
  "Casual",
  "Apology",
  "Appreciation",
  "Follow-up",
  "Request",
  "Persuasive",
  "Concise",
];

const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTone, setSelectedTone] = useState("All");
  const [selectedDate, setSelectedDate] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHistoryApi({
        search: search.trim() || undefined,
        tone: selectedTone !== "All" ? selectedTone : undefined,
        date: selectedDate !== "all" ? selectedDate : undefined,
      });
      setHistory(data.history || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [search, selectedTone, selectedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchHistory]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(id);
    try {
      await deleteHistoryApi(id);
      toast.success("History item deleted");
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (text, type, e) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <PageLayout>
      <PageHeader
        title="Email History"
        description="View, search, filter, and manage your past AI email replies and summaries."
      />

      {/* Filters Bar inside Glass Box */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search email contents or replies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="apple-input w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Tone Filter */}
          <div className="relative flex items-center">
            <FiFilter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="apple-input pl-9 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
            >
              {TONES.map((t) => (
                <option key={t} value={t} className="bg-white text-slate-900">
                  {t === "All" ? "All Tones" : t}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative flex items-center">
            <FiClock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="apple-input pl-9 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
            >
              {DATE_FILTERS.map((d) => (
                <option key={d.value} value={d.value} className="bg-white text-slate-900">
                  {d.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader />
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            title="No history found"
            description="Generate a reply or summarize an email in your workspace to build your history."
            actionLabel="Go to Workspace"
            actionTo="/workspace"
          />
        ) : (
          history.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <Card
                key={item.id}
                className="cursor-pointer transition-all hover:border-slate-300"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="mt-0.5 rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-blue-600 shrink-0">
                      <FiMail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {item.subject || "Untitled Email"}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {item.summary || item.originalEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      {item.tone && (
                        <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {item.tone}
                        </span>
                      )}
                      {item.length && (
                        <span className="rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {item.length}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        disabled={deletingId === item.id}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 transition-colors"
                        title="Delete entry"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? (
                          <FiChevronUp className="h-4 w-4" />
                        ) : (
                          <FiChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className="mt-4 pt-4 border-t border-slate-200 space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Original Email
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleCopy(item.originalEmail, "Original email", e)}
                        >
                          <FiCopy className="h-3.5 w-3.5 mr-1" /> Copy
                        </Button>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {item.originalEmail}
                      </div>
                    </div>

                    {item.generatedReply && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            Generated Reply
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => handleCopy(item.generatedReply, "Generated reply", e)}
                          >
                            <FiCopy className="h-3.5 w-3.5 mr-1" /> Copy Reply
                          </Button>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                          {item.generatedReply}
                        </div>
                      </div>
                    )}

                    {item.summary && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            Summary
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleCopy(item.summary, "Summary", e)}
                          >
                            <FiCopy className="h-3.5 w-3.5 mr-1" /> Copy Summary
                          </Button>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {item.summary}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </PageLayout>
  );
};

export default History;
