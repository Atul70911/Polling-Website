import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import UserInfo from "./UserInfo";
import { useApp } from "../ContextProvider/AppContext";
import "../style/Dashboard.css";

export default function Dashboard() {
  const { fetchFeed, loading, error } = useApp();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const fetchedPolls = await fetchFeed();
        if (fetchedPolls) {
          setPolls(fetchedPolls);
        }
      } catch (err) {
        console.error("Failed to load feed:", err);
      }
    };
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard-layout">
      

      {/* 2. Middle Column (The Feed) */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
        </header>

        <section className="dashboard-feed">
          {error && <p className="dashboard-error">{error}</p>}

          {loading ? (
            <div className="dashboard-status">Loading polls...</div>
          ) : polls.length === 0 && !error ? (
            <div className="dashboard-status dashboard-empty">
              <p>No polls available right now. Be the first to create one!</p>
            </div>
          ) : (
            <div className="dashboard-poll-list">
              {polls.map((poll) => (
                <div key={poll._id || poll.id} className="dashboard-poll-card">
                  <div className="poll-card-header">
                    <span className="poll-card-type">{poll.type}</span>
                    {poll.creator?.name && (
                      <span className="poll-card-author">By {poll.creator.name}</span>
                    )}
                  </div>
                  
                  <h3 className="poll-card-question">{poll.question}</h3>
                  <button className="poll-card-btn">View Poll</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

     
    </div>
  );
}