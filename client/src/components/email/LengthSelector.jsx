import { LENGTHS } from "../../utils/constants";

const LengthSelector = ({ value, onChange }) => {
  return (
    <div>
      <label className="mb-2.5 block text-sm font-semibold text-slate-900">
        Length
      </label>
      <div className="flex flex-wrap gap-2">
        {LENGTHS.map((len) => (
          <button
            key={len}
            type="button"
            onClick={() => onChange(len)}
            className={`rounded-xl px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
              value === len
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {len}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LengthSelector;
