import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit3, FiClock, FiTrendingUp, FiMail, FiArrowRight, FiUser } from "react-icons/fi";
import PageLayout from "../components/layout/PageLayout";
import Card, { CardTitle, CardDescription } from "../components/common/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";
import { getHistoryApi } from "../services/history";

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getHistoryApi();
        setHistory(data.history || []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const totalReplies = history.filter((h) => h.generatedReply).length;
  const totalSummaries = history.filter((h) => h.summary).length;

  const stats = [
    {
      label: "Replies Generated",
      value: loading ? "..." : totalReplies,
      icon: FiMail,
      sub: "Total AI replies created",
    },
    {
      label: "Summaries Created",
      value: loading ? "..." : totalSummaries,
      icon: FiTrendingUp,
      sub: "Emails summarized",
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title={`Welcome back, ${user?.name || "User"}`}
        description="Overview of your email productivity and recent AI generations."
        action={
          <Link to="/workspace">
            <Button variant="primary">
              <FiEdit3 className="h-4 w-4" /> New Reply <FiArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      {/* 2 Metric Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {stats.map((s) => (
          <Card key={s.label} hover>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest generated replies and summaries.</CardDescription>
            </div>
            {history.length > 0 && (
              <Link to="/history" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all
              </Link>
            )}
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading activity...</p>
          ) : history.length === 0 ? (
            <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <p className="text-sm text-slate-500">No activity yet — start in the Workspace</p>
              <Link to="/workspace" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  Go to Workspace
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4 hover:bg-slate-100/80 transition-all"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {item.subject || "Untitled Email"}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.summary || item.generatedReply || item.originalEmail}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Shortcuts to key tools.</CardDescription>
          <div className="mt-4 space-y-3">
            <Link
              to="/workspace"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <FiEdit3 className="h-4 w-4 text-blue-600" /> New Reply
              </span>
              <FiArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              to="/history"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <FiClock className="h-4 w-4 text-blue-600" /> View History
              </span>
              <FiArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <FiUser className="h-4 w-4 text-blue-600" /> Edit Profile
              </span>
              <FiArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
