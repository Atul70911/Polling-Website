import React, { useEffect, useState } from "react";
import { Bookmark, User, ArrowRight } from "lucide-react";
import { useApp } from "../ContextProvider/AppContext";
import { getBookmarksApi } from "../api/polls.api";
import { timeAgo } from "../utils/time";
import toast from "react-hot-toast";

const typeBadgeColor = {
  SingleChoice: "bg-blue-100 text-blue-700",
  YesNo:        "bg-green-100 text-green-700",
  Rating:       "bg-yellow-100 text-yellow-700",
  ImageBased:   "bg-purple-100 text-purple-700",
};

const Bookmarks = () => {
  const { setPage, setSelectedPoll, toggleBookmark, user } = useApp();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBookmarksApi();
        setPolls(res?.data?.data || []);
      } catch (err) {
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleRemoveBookmark = async (e, pollId) => {
    e.stopPropagation();
    setRemovingId(pollId);
    try {
      await toggleBookmark(pollId);
      setPolls((prev) => prev.filter((p) => p._id !== pollId));
      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewPoll = (poll) => {
    setSelectedPoll(poll);
    setPage("ViewPoll");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
      Loading bookmarks...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bookmark size={20} className="text-blue-700 fill-blue-700" />
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
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
            <Bookmark size={28} className="text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No saved polls yet</h3>
          <p className="text-sm text-gray-400 mb-5">
            Polls you bookmark will appear here.
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

                  {/* Type badge */}
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 ${
                    typeBadgeColor[poll.type] || "bg-gray-100 text-gray-500"
                  }`}>
                    {poll.type}
                  </span>

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
                    {poll.closed && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-red-400 font-medium">Closed</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bookmark remove button */}
                <button
                  onClick={(e) => handleRemoveBookmark(e, poll._id)}
                  disabled={removingId === poll._id}
                  className="shrink-0 p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-40"
                  title="Remove bookmark"
                >
                  <Bookmark size={16} className="fill-rose-400" />
                </button>
              </div>

              {/* View poll footer */}
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

export default Bookmarks;