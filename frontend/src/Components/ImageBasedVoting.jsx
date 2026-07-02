
const pct = (val, total) =>
  total > 0 ? Math.round((val / total) * 100) : 0;


const ImageBasedVoting = ({ options, selected, onSelect, hasVoted }) => {
  const totalVotes = options.reduce((s, o) => s + (o.votes || 0), 0);
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, i) => {
        const isSelected = selected === i;
        const p = pct(opt.votes || 0, totalVotes);
        return (
          <button
            key={i}
            onClick={() => !hasVoted && onSelect(i)}
            disabled={hasVoted}
            className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-video disabled:cursor-default ${
              isSelected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={opt.url}
              alt={`Option ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {hasVoted && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-bold text-xl">{p}%</span>
              </div>
            )}
            {isSelected && !hasVoted && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};


export default ImageBasedVoting;