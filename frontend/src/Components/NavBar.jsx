import React, { useState } from "react";
import { useApp } from "../ContextProvider/AppContext";
import { Search, Bell } from "lucide-react";


const NavBar = () => {
  const { user, page, setPage } = useApp();
  const [query, setQuery] = useState("");

  const isLoggedIn = !!user;

  return (
    <nav className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-20">
      {/* Logo — always visible */}
      <button
        onClick={() => setPage(isLoggedIn ? "DashBoard" : "Login")}
        className="text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
      >
        VoxPopuli
      </button>

      {isLoggedIn ? (
        <>
          

          {/* Right: search + bell */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search polls..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full border border-transparent
                           focus:outline-none focus:bg-white focus:border-gray-300 transition-all w-52"
              />
            </div>

            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </>
      ) : (
        /* Auth buttons */
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage("Login")}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setPage("SignUp")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;