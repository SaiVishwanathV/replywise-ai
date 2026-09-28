const Loader = ({ size = "md", text, fullScreen = false, className = "" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-[3px]",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />
      {text && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f5f7fb]/80 backdrop-blur-xl ${className}`}
      >
        {spinner}
      </div>
    );
  }

  return <div className={`flex items-center justify-center p-8 ${className}`}>{spinner}</div>;
};

export default Loader;
