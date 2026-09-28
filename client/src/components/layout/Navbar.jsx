import { Link } from "react-router-dom";
import { FiMenu, FiMail } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 lg:hidden hover:bg-slate-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <FiMail className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              ReplyWise AI
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3.5 hover:bg-slate-100 transition-all"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                {getInitials(user.name)}
              </div>
              <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                {user.name}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
