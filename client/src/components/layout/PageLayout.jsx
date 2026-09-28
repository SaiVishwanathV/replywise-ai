import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PageLayout = ({ children, showSidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 flex flex-col">
      <Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1">
        {showSidebar && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
