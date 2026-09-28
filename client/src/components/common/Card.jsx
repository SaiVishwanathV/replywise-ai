const Card = ({
  children,
  className = "",
  hover = false,
  padding = "p-6",
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm ${
        hover
          ? "hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          : ""
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-lg font-semibold tracking-tight text-slate-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-slate-500 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`mt-4 flex items-center ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
