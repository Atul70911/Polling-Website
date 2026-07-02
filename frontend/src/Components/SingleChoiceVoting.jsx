
const pct = (val, total) =>
  total > 0 ? Math.round((val / total) * 100) : 0;


const SingleChoiceVoting = ({ options, selected, onSelect, hasVoted }) => {
  const totalVotes = options.reduce((s, o) => s + (o.votes || 0), 0);
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt, i) => {
        const isSelected = selected === i;
        const p = pct(opt.votes || 0, totalVotes);
        return (
          <button
            key={i}
            onClick={() => !hasVoted && onSelect(i)}
            disabled={hasVoted}
            className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-colors disabled:cursor-default relative overflow-hidden ${
              isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {hasVoted && (
              <div
                className="absolute inset-0 bg-blue-100/50 origin-left transition-all"
                style={{ width: `${p}%` }}
              />
            )}
            <div className={`relative mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              isSelected ? "border-blue-600" : "border-gray-300"
            }`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
            </div>
            <div className="relative flex-1 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{opt.optionText}</p>
              {hasVoted && <span className="text-xs text-gray-500 font-medium">{p}%</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
};



export default SingleChoiceVoting




