import React, { useEffect, useState } from "react";
import { useApp } from "../ContextProvider/AppContext";
import { Heart, Share2, User,Bookmark } from "lucide-react";
import toast from 'react-hot-toast';


const BADGE_STYLES = {
  Politics: "bg-orange-100 text-orange-700",
  Tech: "bg-amber-100  text-amber-700",
  Social: "bg-teal-100   text-teal-700",
  Climate: "bg-green-100  text-green-700",
  Economy: "bg-blue-100   text-blue-700",
  Healthcare: "bg-rose-100   text-rose-700",
  YesNo: "bg-purple-100 text-purple-700",
  Rating: "bg-yellow-100 text-yellow-700",
  SingleChoice: "bg-sky-100    text-sky-700",
  ImageBased: "bg-pink-100   text-pink-700",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const h = Math.floor((Date.now() - new Date(dateStr)) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PollCard({ poll }) {

  const { setPage, setSelectedPoll, toggleBookmark, user } = useApp();
  const label = poll.category || poll.type;
  const badgeClass = BADGE_STYLES[label] ?? "bg-gray-100 text-gray-600";
  const [bookmarked, setBookmarked] = useState(
    poll.bookmarkedBy?.some((id) => String(id) === String(user?._id)) ?? false
  );
  const [loading, setLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.stopPropagation(); // prevent triggering card click / View Poll
    if (loading) return;
    setLoading(true);
    try {
      await toggleBookmark(poll._id);
      setBookmarked((prev) => !prev);
      toast.success(bookmarked ? "Bookmark removed" : "Poll bookmarked!");
    } catch (err) {
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow ">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
          {label}
        </span>
        <span className="text-xs text-gray-400">{timeAgo(poll.createdAt)}</span>
      </div>

      {/* Question */}
      <h3 className="text-gray-900 font-semibold text-[15px] leading-snug mb-3">
        {poll.question}
      </h3>

      {/* Creator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {poll.creator?.avatar
            ? <img src={poll.creator.avatar} alt="" className="w-full h-full object-cover" />
            : <User size={12} className="text-gray-400" />}
        </div>
        <span className="text-xs text-gray-500">
          Created by{" "}
          <span className="text-gray-700 font-medium">
            {poll.creator?.name || "Anonymous"}
          </span>
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`transition-colors disabled:opacity-50 ${bookmarked ? "text-rose-500" : "text-gray-400 hover:text-rose-500"
              }`}
          >
            <Bookmark size={16} className={bookmarked ? "fill-rose-500" : ""} />
          </button>
          <button className="text-gray-400 hover:text-blue-500 transition-colors">
            <Share2 size={16} />
          </button>


        </div>
        <button className="bg-[#1a2744] hover:bg-[#14203a] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors"
          onClick={() => { setSelectedPoll(poll); setPage("ViewPoll"); }}>
          View Poll
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { fetchFeed, loading, error } = useApp();
  const [polls, setPolls] = useState([]);
  const [activeTab, setActiveTab] = useState("Trending");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFeed();
        if (data) setPolls(data);
      } catch (err) {
        console.error("Failed to load feed:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>

        <div className="flex items-center gap-2">
          {["Latest", "Trending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeTab === tab
                  ? "bg-[#1a2744] text-white border-[#1a2744]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>



      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Loading polls…
        </div>
      ) : polls.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No polls available right now. Be the first to create one!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {polls.map((poll) => (
            <PollCard key={poll._id || poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}