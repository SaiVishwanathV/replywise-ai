import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
  return (
    <PageLayout showSidebar={false}>
      <div className="mx-auto max-w-lg text-center">
        <Card className="py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <FiAlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white">404</h1>
          <p className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Page not found</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button size="lg">
              <FiHome className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
};

export default NotFound;
