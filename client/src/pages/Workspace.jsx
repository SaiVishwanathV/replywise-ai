import { useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EmailInput from "../components/email/EmailInput";
import ToneSelector from "../components/email/ToneSelector";
import LengthSelector from "../components/email/LengthSelector";
import ReplyCard from "../components/email/ReplyCard";
import SummaryCard from "../components/email/SummaryCard";
import {
  FiZap,
  FiRefreshCw,
  FiFileText,
  FiEdit,
  FiDownload,
  FiSliders,
} from "react-icons/fi";
import {
  generateReplyApi,
  rewriteReplyApi,
  summarizeEmailApi,
} from "../services/email";

const Workspace = () => {
  const [email, setEmail] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [customInstructions, setCustomInstructions] = useState("");

  const [reply, setReply] = useState("");
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState([]);

  const [loadingReply, setLoadingReply] = useState(false);
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleGenerateReply = async () => {
    if (!email.trim()) {
      toast.error("Please paste an email first");
      return;
    }
    setLoadingReply(true);
    try {
      const data = await generateReplyApi({
        originalEmail: email,
        tone,
        length,
        customInstructions,
      });
      setReply(data.generatedReply);
      toast.success("AI reply generated & saved to history!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate reply");
    } finally {
      setLoadingReply(false);
    }
  };

  const handleRewriteReply = async () => {
    if (!email.trim()) {
      toast.error("Please paste an email first");
      return;
    }
    setLoadingRewrite(true);
    try {
      const data = await rewriteReplyApi({
        originalEmail: email,
        existingReply: reply,
        tone,
        length,
        customInstructions,
      });
      setReply(data.generatedReply);
      toast.success("Reply rewritten with new tone/instructions!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rewrite reply");
    } finally {
      setLoadingRewrite(false);
    }
  };

  const handleSummarizeEmail = async () => {
    if (!email.trim()) {
      toast.error("Please paste an email first");
      return;
    }
    setLoadingSummary(true);
    try {
      const data = await summarizeEmailApi({ originalEmail: email });
      setSummary(data.summary);
      setKeyPoints(data.keyPoints || []);
      toast.success("Email summarized!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to summarize email");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDownload = () => {
    if (!reply) return;
    const blob = new Blob([reply], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `replywise-reply-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Reply downloaded!");
  };

  const handleClear = () => {
    setEmail("");
    setReply("");
    setSummary("");
    setKeyPoints([]);
    setCustomInstructions("");
  };

  return (
    <PageLayout>
      <PageHeader
        title="ReplyWise Workspace"
        description="Generate intelligent email replies and summaries using ReplyWise AI."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Left Input Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="mt-6 space-y-5">
              <ToneSelector value={tone} onChange={setTone} />
              <LengthSelector value={length} onChange={setLength} />

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <FiSliders className="h-4 w-4 text-blue-600" />
                  Custom Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g., Mention I am available on Thursday after 3 PM..."
                  className="apple-input w-full p-3.5 text-sm resize-none"
                />
              </div>
            </div>

            {/* Full-width Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="primary"
                fullWidth
                onClick={handleGenerateReply}
                disabled={!email.trim() || loadingReply}
              >
                <FiZap className="h-4 w-4" />
                {loadingReply ? "Generating..." : "Generate Reply"}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                fullWidth
                onClick={handleSummarizeEmail}
                disabled={!email.trim() || loadingSummary}
              >
                <FiFileText className="h-4 w-4" />
                {loadingSummary ? "Summarizing..." : "Summarize Email"}
              </Button>
            </div>

            {email || reply || summary ? (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <FiRefreshCw className="h-3.5 w-3.5 mr-1" /> Clear All
                </Button>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <ReplyCard
              reply={reply}
              tone={tone}
              onCopy={() => toast.success("Reply copied!")}
            />

            {reply && (
              <div className="mt-3 flex flex-wrap gap-2 justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleRewriteReply}
                  disabled={loadingRewrite}
                >
                  <FiEdit className="h-3.5 w-3.5 mr-1" />
                  {loadingRewrite ? "Rewriting..." : "Rewrite"}
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleGenerateReply}
                  disabled={loadingReply}
                >
                  <FiRefreshCw className="h-3.5 w-3.5 mr-1" />
                  Regenerate
                </Button>

                <Button size="sm" variant="ghost" onClick={handleDownload}>
                  <FiDownload className="h-3.5 w-3.5 mr-1" /> Download
                </Button>
              </div>
            )}
          </div>

          <SummaryCard summary={summary} keyPoints={keyPoints} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Workspace;
