import React from "react";
import { useApp } from "../ContextProvider/AppContext";
import { BarChart2, Users, Bookmark, User } from "lucide-react";

const TOP_TOPICS = ["Climate", "Economy", "Healthcare", "AI"];

const UserInfo = () => {
  const { name, userName, src, user } = useApp();

  const displayName   = user?.name     || name     || "John Doe";
  const displayHandle = user?.username || userName || "johndoe_vox";
  const pollsCreated    = user?.pollsCreated    ?? 0;
  const pollsVoted      = user?.pollsVoted      ?? 0;
  const pollsBookmarked = user?.pollsBookmarked ?? 0;

  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
        {/* Avatar + online dot */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {src
              ? <img src={src} alt="Profile" className="w-full h-full object-cover" />
              : <User size={32} className="text-gray-400" />}
          </div>
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-tight">{displayName}</h3>
        <p className="text-sm text-gray-500 mb-4">@{displayHandle}</p>

        <button className="w-full border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Edit Profile
        </button>

        {/* Stats */}
        <div className="w-full border-t border-gray-100 mt-5 pt-4 flex flex-col gap-3">
          {[
            { icon: BarChart2, count: pollsCreated,    label: "Polls Created" },
            { icon: Users,     count: pollsVoted,      label: "Polls Voted" },
            { icon: Bookmark,  count: pollsBookmarked, label: "Polls Bookmarked" },
          ].map(({ icon: Icon, count, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
              <Icon size={15} className="text-blue-500 shrink-0" />
              <span>
                <span className="font-semibold text-gray-900">{count}</span> {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Topics card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Top Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {TOP_TOPICS.map((topic) => (
            <button
              key={topic}
              className="text-xs font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;