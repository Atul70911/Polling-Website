import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import UserInfo from "./UserInfo";
import { useApp } from "../ContextProvider/AppContext";
import "../style/Dashboard.css";

export default function Dashboard() {
  const { fetchFeed, loading, error } = useApp();
  const [polls, setPolls] = useState([]);

  // Fetch the feed exactly once when the Dashboard loads
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
    <div className="dashboard">
      {/* 1. Sidebar typically goes on the left */}
      <SideBar />

      <main className="dashboard__main">
        {/* 2. Header with title and UserInfo */}
        <header className="dashboard__header">
          <h1 className="dashboard__title">Dashboard</h1>
          <UserInfo />
        </header>

        {/* 3. Feed Content Area */}
        <section className="dashboard__feed">
          {error && <p className="dashboard__error">{error}</p>}

          {loading ? (
            <div className="dashboard__loading">Loading polls...</div>
          ) : polls.length === 0 && !error ? (
            <div className="dashboard__empty">
              <p>No polls available right now. Be the first to create one!</p>
            </div>
          ) : (
            <div className="dashboard__pollList">
              {polls.map((poll) => (
                <div key={poll._id || poll.id} className="dashboard__pollCard">
                  <div className="pollCard__header">
                    <span className="pollCard__type">{poll.type}</span>
                    {/* If you populated creator, you can show their name */}
                    {poll.creator?.name && (
                      <span className="pollCard__author">By {poll.creator.name}</span>
                    )}
                  </div>
                  
                  <h3 className="pollCard__question">{poll.question}</h3>
                  
                  {/* You can add a "Vote" button or render specific options based on poll.type here */}
                  <button className="pollCard__viewBtn">View Poll</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}