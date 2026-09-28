import { NavLink } from "react-router-dom";
import { FiGrid, FiEdit3, FiClock, FiUser, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: FiGrid },
  { label: "ReplyWise Workspace", to: "/workspace", icon: FiEdit3 },
  { label: "History", to: "/history", icon: FiClock },
  { label: "Profile", to: "/profile", icon: FiUser },
];

const SidebarContent = ({ onClose }) => (
  <div className="flex h-full flex-col justify-between p-4">
    <div>
      <div className="flex h-12 items-center justify-between px-3 lg:hidden mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </span>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  </div>
);

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white/60 backdrop-blur-xl lg:block">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent onClose={onClose} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-[280px] bg-white/95 backdrop-blur-2xl border-r border-slate-200 shadow-xl lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
