import React from "react";
import "../style/SideBar.css";
import { useApp } from "../ContextProvider/AppContext";
import {
  LayoutDashboard,
  LogOut,
  Bookmark,
  CircleCheckBig,
  PenTool,
  PencilLine,
} from "lucide-react";



    
const SideBar = () => {
  const { setPage } = useApp();
  return (
    <aside className="sidebar">
      <div className="sidebar__title">Polling Project</div>

      <nav className="sidebar__nav">
        <button className="sidebar__item" onClick={()=>{setPage('DashBoard')}}>
          <LayoutDashboard className="sidebar__icon" size={22} />
          <span>Dashboard</span>
        </button>

        <button className="sidebar__item" onClick={()=>{setPage('CreatePoll')}}>
          <PencilLine className="sidebar__icon" size={22} />
          <span>Create Poll</span>
        </button>

        <button className="sidebar__item" onClick={()=>{setPage('MyPolls')}}>
          <PenTool className="sidebar__icon" size={22} />
          <span>My Polls</span>
        </button>

        <button className="sidebar__item" onClick={()=>{setPage('VotedPolls')}}>
          <CircleCheckBig className="sidebar__icon" size={22} />
          <span>Voted Polls</span>
        </button>

        <button className="sidebar__item" onClick={()=>{setPage('Bookmarks')}}>
          <Bookmark className="sidebar__icon" size={22} />
          <span>Bookmarks</span>
        </button>

        <div className="sidebar__divider" />

        <button className="sidebar__item sidebar__item--danger" onClick={()=>{setPage('Login')}}>
          <LogOut className="sidebar__icon" size={22} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
