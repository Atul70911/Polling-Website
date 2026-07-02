import { Star } from "lucide-react";

const pct = (val, total) =>
  total > 0 ? Math.round((val / total) * 100) : 0;


const RatingVoting = ({ selected, onSelect, hasVoted, poll }) => {
  const [hovered, setHovered] = useState(null);
  const avg = poll.ratingCount > 0
    ? (poll.ratingSum / poll.ratingCount).toFixed(1)
    : null;
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered ?? selected ?? 0);
          return (
            <button
              key={star}
              onClick={() => !hasVoted && onSelect(star)}
              onMouseEnter={() => !hasVoted && setHovered(star)}
              onMouseLeave={() => !hasVoted && setHovered(null)}
              disabled={hasVoted}
              className="disabled:cursor-default transition-transform hover:scale-110"
            >
              <Star
                size={40}
                className={`transition-colors ${
                  filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {selected && !hasVoted && (
        <p className="text-sm text-gray-500">You selected <span className="font-semibold text-gray-800">{selected} star{selected > 1 ? "s" : ""}</span></p>
      )}
      {hasVoted && avg && (
        <div className="text-center">
          <p className="text-3xl font-extrabold text-gray-900">{avg}<span className="text-lg text-gray-400">/5</span></p>
          <p className="text-xs text-gray-500 mt-1">Average from {poll.ratingCount} rating{poll.ratingCount !== 1 ? "s" : ""}</p>
        </div>
      )}
    </div>
  );
};


export default RatingVoting