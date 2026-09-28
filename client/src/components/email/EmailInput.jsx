const EmailInput = ({ value, onChange, placeholder = "Paste your email content here...", rows = 8 }) => {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        Original Email
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="apple-input w-full p-4 text-sm resize-none leading-relaxed"
      />
    </div>
  );
};

export default EmailInput;
