import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import LandingNavbar from "../components/layout/LandingNavbar";
import Button from "../components/common/Button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-700">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Write better emails{" "}
              <span className="text-blue-600">
                in seconds.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
              AI-powered assistant that helps generate professional email replies
              and summarize long emails instantly.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="primary" className="px-8">
                  Get Started <FiArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
