import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-6 shadow-sm">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <FiMail className="h-5 w-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900">
            ReplyWise AI
          </span>
        </Link>
      </div>
    </header>
  );
};

export default LandingNavbar;
