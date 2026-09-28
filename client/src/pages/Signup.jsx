import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight, FiShield, FiKey } from "react-icons/fi";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import PageHeader from "../components/ui/PageHeader";
import useAuth from "../hooks/useAuth";
import { verifyOtpApi, resendOtpApi } from "../services/auth";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, user } = useAuth();

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (showOtpStep && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [showOtpStep, resendTimer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await signup(form);
      toast.success(res.message || "Account created! OTP sent to your email.");
      setShowOtpStep(true);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter 6-digit OTP code");
      return;
    }
    setVerifying(true);
    try {
      const res = await verifyOtpApi({ email: form.email, otp });
      toast.success(res.message || "Email verified! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      await resendOtpApi(form.email);
      toast.success("New OTP code sent to your email!");
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <PageLayout showSidebar={false}>
      <div className="mx-auto max-w-md pt-8">
        <PageHeader
          title={showOtpStep ? "Verify Your Email" : "Create Account"}
          description={
            showOtpStep
              ? `We sent a 6-digit verification code to ${form.email}`
              : "Join ReplyWise AI and start crafting perfect email replies instantly."
          }
        />

        <Card className="mt-6">
          {!showOtpStep ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Username
                </label>
                <div className="relative">
                  <FiShield className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    placeholder="alexmorgan"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <Button fullWidth size="lg" variant="primary" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}{" "}
                <FiArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative">
                  <FiKey className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-center text-lg font-mono tracking-widest"
                  />
                </div>
              </div>

              <Button fullWidth size="lg" variant="primary" type="submit" disabled={verifying}>
                {verifying ? "Verifying..." : "Verify OTP & Continue"}
              </Button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Didn't receive code?"}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Signup;
