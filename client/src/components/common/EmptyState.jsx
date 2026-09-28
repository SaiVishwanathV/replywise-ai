import { FiInbox } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "./Button";

const EmptyState = ({
  icon: Icon = FiInbox,
  title = "No data yet",
  description = "Get started by creating your first item.",
  actionLabel,
  onAction,
  actionTo,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 backdrop-blur-xl px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
        <Icon className="h-7 w-7 text-blue-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="mt-6">
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      ) : (
        actionLabel &&
        onAction && (
          <Button onClick={onAction} className="mt-6">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
