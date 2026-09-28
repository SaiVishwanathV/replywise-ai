import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiKey, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import PageHeader from "../components/ui/PageHeader";
import useAuth from "../hooks/useAuth";
import { forgotPasswordApi, resetPasswordApi } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Forgot Password flow states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter email or username and password");
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await forgotPasswordApi(resetEmail);
      toast.success(res.message || "Reset OTP sent to your email!");
      setForgotStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword) {
      toast.error("Please enter OTP code and new password");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await resetPasswordApi({
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });
      toast.success(res.message || "Password updated! You can now log in.");
      setIsForgotMode(false);
      setForgotStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <PageLayout showSidebar={false}>
      <div className="mx-auto max-w-md pt-8">
        <PageHeader
          title={isForgotMode ? "Reset Password" : "Welcome Back"}
          description={
            isForgotMode
              ? forgotStep === 1
                ? "Enter your email to receive a password reset OTP code."
                : `Enter the 6-digit OTP sent to ${resetEmail} and your new password.`
              : "Sign in to your ReplyWise AI account."
          }
        />

        <Card className="mt-6">
          {!isForgotMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email or Username
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email or Username"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotStep(1);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
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
                {loading ? "Signing in..." : "Sign in"}{" "}
                <FiArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div>
              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetEmail} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Account Email
                    </label>
                    <div className="relative">
                      <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                      />
                    </div>
                  </div>

                  <Button fullWidth size="lg" variant="primary" type="submit" disabled={forgotLoading}>
                    {forgotLoading ? "Sending Code..." : "Send Reset Code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      6-Digit Reset OTP
                    </label>
                    <div className="relative">
                      <FiKey className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="apple-input w-full py-2.5 pl-10 pr-4 text-center text-lg font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                      />
                    </div>
                  </div>

                  <Button fullWidth size="lg" variant="primary" type="submit" disabled={forgotLoading}>
                    {forgotLoading ? "Resetting Password..." : "Update Password"}
                  </Button>
                </form>
              )}

              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setForgotStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <FiArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </button>
              </div>
            </div>
          )}

          {!isForgotMode && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
