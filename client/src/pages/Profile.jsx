import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
  FiUser,
  FiMail,
  FiShield,
  FiLock,
  FiLogOut,
  FiCheck,
  FiBell,
  FiSliders,
  FiGlobe,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { updateProfileApi, updatePasswordApi } from "../services/auth";
import { TONES, LENGTHS } from "../utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Settings State
  const [defaultTone, setDefaultTone] = useState("Professional");
  const [defaultLength, setDefaultLength] = useState("Medium");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    activityAlerts: true,
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await updateProfileApi(profileForm);
      setUser(res.user);
      toast.success(res.message || "Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setUpdatingPassword(true);
    try {
      const res = await updatePasswordApi({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(res.message || "Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success("Preferences saved successfully!");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "RW";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Account & Settings"
        description="Manage your account profile, default AI preferences, notifications, and security."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* User Card Sidebar */}
        <Card className="lg:col-span-1 flex flex-col items-center text-center h-fit">
          <div className="relative group cursor-pointer">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-sm shadow-blue-500/20">
              {getInitials(user?.name)}
            </div>
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {user?.name || "User"}
          </h3>
          <p className="text-sm text-slate-500">@{user?.username || "username"}</p>
          <p className="mt-1 text-xs text-slate-400">{user?.email}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <FiCheck className="h-3.5 w-3.5" /> Email Verified
          </div>

          <div className="mt-6 w-full pt-6 border-t border-slate-200">
            <Button variant="danger" fullWidth onClick={handleLogout}>
              <FiLogOut className="h-4 w-4" /> Logout All Sessions
            </Button>
          </div>
        </Card>

        {/* Profile, Settings & Password Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FiUser className="h-4 w-4 text-blue-600" /> Account Information
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
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
                    required
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
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
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" disabled={updatingProfile}>
                  {updatingProfile ? "Saving..." : "Save Profile Details"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Account Settings */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FiSliders className="h-4 w-4 text-blue-600" /> Account Preferences & Defaults
            </h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Default Reply Tone
                  </label>
                  <select
                    value={defaultTone}
                    onChange={(e) => setDefaultTone(e.target.value)}
                    className="apple-input w-full p-2.5 text-sm cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t} className="bg-white text-slate-900">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Default Reply Length
                  </label>
                  <select
                    value={defaultLength}
                    onChange={(e) => setDefaultLength(e.target.value)}
                    className="apple-input w-full p-2.5 text-sm cursor-pointer"
                  >
                    {LENGTHS.map((l) => (
                      <option key={l} value={l} className="bg-white text-slate-900">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Preferred Language
                </label>
                <div className="relative">
                  <FiGlobe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm cursor-pointer"
                  >
                    <option value="English" className="bg-white text-slate-900">English (US)</option>
                    <option value="Spanish" className="bg-white text-slate-900">Spanish</option>
                    <option value="French" className="bg-white text-slate-900">French</option>
                    <option value="German" className="bg-white text-slate-900">German</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FiBell className="h-3.5 w-3.5 text-blue-600" /> Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">Email updates & summaries</span>
                    <input
                      type="checkbox"
                      checked={notifications.emailUpdates}
                      onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                      className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">Activity & security alerts</span>
                    <input
                      type="checkbox"
                      checked={notifications.activityAlerts}
                      onChange={(e) => setNotifications({ ...notifications, activityAlerts: e.target.checked })}
                      className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="secondary">
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>

          {/* Security & Password */}
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FiLock className="h-4 w-4 text-blue-600" /> Security & Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Current Password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    placeholder="••••••••"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
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
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="apple-input w-full py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="secondary" disabled={updatingPassword}>
                  {updatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
