import React from "react";
import { useApp } from "../ContextProvider/AppContext";
import {
  LayoutDashboard,
  LogOut,
  Bookmark,
  CircleCheckBig,
  PenTool,
  PencilLine,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",   icon: LayoutDashboard, key: "DashBoard" },
  { label: "Create Poll", icon: PencilLine,       key: "CreatePoll" },
  { label: "My Polls",    icon: PenTool,          key: "MyPolls" },
  { label: "Voted Polls", icon: CircleCheckBig,   key: "VotedPolls" },
  { label: "Bookmarks",   icon: Bookmark,         key: "Bookmarks" },
];

const SideBar = () => {
  const { page, setPage, logout } = useApp();

  return (
    <aside className="h-full bg-white border-r border-gray-100 flex flex-col pt-4 pb-6 px-3">
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ label, icon: Icon, key }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              page === key
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon
              size={18}
              className={page === key ? "text-indigo-600" : "text-gray-400"}
            />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;