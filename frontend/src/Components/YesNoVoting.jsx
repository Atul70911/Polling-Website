
const pct = (val, total) =>
  total > 0 ? Math.round((val / total) * 100) : 0;


const YesNoVoting = ({ selected, onSelect, hasVoted, poll }) => {
  const total = (poll.yes || 0) + (poll.no || 0);
  const yesPct = pct(poll.yes || 0, total);
  const noPct = pct(poll.no || 0, total);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {[
          { label: "Yes ✅", value: "yes", pct: yesPct, color: "bg-green-500" },
          { label: "No ❌", value: "no", pct: noPct, color: "bg-red-500" },
        ].map(({ label, value, pct: p, color }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              onClick={() => !hasVoted && onSelect(value)}
              disabled={hasVoted}
              className={`flex-1 py-5 rounded-xl border-2 font-bold text-lg transition-all disabled:cursor-default ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {hasVoted && (
        <div className="space-y-2">
          {[
            { label: "Yes", p: yesPct, color: "bg-green-500" },
            { label: "No", p: noPct, color: "bg-red-400" },
          ].map(({ label, p, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{label}</span>
                <span>{p}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${p}%` }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-right">{total} total votes</p>
        </div>
      )}
    </div>
  );
};


export default YesNoVoting