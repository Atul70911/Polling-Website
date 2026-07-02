import React, { useEffect, useState } from "react";
import { CheckCircle, User, ArrowRight } from "lucide-react";
import { useApp } from "../ContextProvider/AppContext";
import { getVotedApi } from "../api/polls.api";
import { timeAgo } from "../utils/time";
import toast from "react-hot-toast";

import { extractImageUrl } from "../utils/extractImageUrl";

const typeBadgeColor = {
  SingleChoice: "bg-blue-100 text-blue-700",
  YesNo:        "bg-green-100 text-green-700",
  Rating:       "bg-yellow-100 text-yellow-700",
  ImageBased:   "bg-purple-100 text-purple-700",
};

const VotePreview = ({ poll, userId }) => {
  switch (poll.type) {
    case "SingleChoice":
    case "ImageBased": {
  const total = poll.options?.reduce((s, o) => s + (o.votes || 0), 0) || 0;
  return (
    <div className="flex flex-col gap-2 mt-3">
      {poll.options?.map((opt, i) => {
        const p = total > 0 ? Math.round(((opt.votes || 0) / total) * 100) : 0;
        const src = extractImageUrl(opt.url);
        return (
          <div key={i} className="flex items-center gap-2">
            {/* Thumbnail */}
            <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
              <img
                src={src}
                alt={`Option ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<span class="text-gray-300 text-xs flex items-center justify-center h-full">🖼️</span>`;
                }}
              />
            </div>
            {/* Bar */}
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                <span>Option {i + 1}</span>
                <span>{p}% · {opt.votes || 0} votes</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-right">{total} total votes</p>
    </div>
  )}

    case "YesNo": {
      const total = (poll.yes || 0) + (poll.no || 0);
      const yesPct = total > 0 ? Math.round(((poll.yes || 0) / total) * 100) : 0;
      const noPct = total > 0 ? Math.round(((poll.no || 0) / total) * 100) : 0;
      return (
        <div className="flex gap-3 mt-3">
          {[
            { label: "Yes ✅", p: yesPct, color: "bg-green-400" },
            { label: "No ❌", p: noPct,  color: "bg-red-400"   },
          ].map(({ label, p, color }) => (
            <div key={label} className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                <span>{label}</span><span>{p}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${p}%` }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "Rating": {
      const avg = poll.ratingCount > 0
        ? (poll.ratingSum / poll.ratingCount).toFixed(1)
        : null;
      return (
        <div className="flex items-center gap-2 mt-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`text-sm ${
                avg && s <= Math.round(Number(avg)) ? "text-yellow-400" : "text-gray-200"
              }`}>★</span>
            ))}
          </div>
          {avg
            ? <span className="text-xs text-gray-500">{avg}/5 avg · {poll.ratingCount} ratings</span>
            : <span className="text-xs text-gray-400">No ratings yet</span>
          }
        </div>
      );
    }

    default:
      return null;
  }
};

const VotedPolls = () => {
  const { setPage, setSelectedPoll } = useApp();
  const [polls, setPolls]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getVotedApi();
        setPolls(res?.data?.data || []);
      } catch {
        toast.error("Failed to load voted polls");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleViewPoll = (poll) => {
    setSelectedPoll(poll);
    setPage("ViewPoll");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
      Loading voted polls...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle size={20} className="text-blue-700" />
        <h1 className="text-2xl font-bold text-gray-900">Voted Polls</h1>
        {polls.length > 0 && (
          <span className="ml-1 text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {polls.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={28} className="text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No votes cast yet</h3>
          <p className="text-sm text-gray-400 mb-5">
            Polls you vote on will appear here with live results.
          </p>
          <button
            onClick={() => setPage("DashBoard")}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            Browse Polls <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {polls.map((poll) => (
            <div
              key={poll._id}
              onClick={() => handleViewPoll(poll)}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">

                  {/* Type badge + voted chip */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      typeBadgeColor[poll.type] || "bg-gray-100 text-gray-500"
                    }`}>
                      {poll.type}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> Voted
                    </span>
                    {poll.closed && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-500 rounded-full">
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {poll.question}
                  </h3>

                  {/* Creator + time */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {poll.creator?.profilePicture
                        ? <img src={poll.creator.profilePicture} alt="" className="w-full h-full object-cover" />
                        : <User size={12} className="text-gray-400" />}
                    </div>
                    <span className="text-xs text-gray-500">
                      {poll.creator?.name || "Anonymous"}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(poll.createdAt)}</span>
                  </div>

                  {/* Results preview */}
                  <VotePreview poll={poll} />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {poll.voters?.length ?? 0} vote{poll.voters?.length !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Poll <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VotedPolls;