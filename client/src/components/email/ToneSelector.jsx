import { TONES } from "../../utils/constants";

const ToneSelector = ({ value, onChange }) => {
  return (
    <div>
      <label className="mb-2.5 block text-sm font-semibold text-slate-900">
        Tone
      </label>
      <div className="flex flex-wrap gap-2">
        {TONES.map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => onChange(tone)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              value === tone
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;
