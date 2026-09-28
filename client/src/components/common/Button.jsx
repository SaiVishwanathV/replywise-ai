const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors",
  outline:
    "border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
  danger:
    "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:-translate-y-0.5 active:translate-y-0",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-xs font-medium rounded-xl",
  md: "px-5 py-2.5 text-sm font-medium rounded-xl",
  lg: "px-6 py-3 text-base font-semibold rounded-2xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

export default Button;
