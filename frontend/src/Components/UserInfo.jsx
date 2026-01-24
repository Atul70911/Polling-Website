import React, { useState } from "react";
import "../style/UserInfo.css";
import background from "../assets/images.jpeg";

import { useApp } from "../ContextProvider/AppContext";


const UserInfo = () => {
  const { userName,name,src,yesNoList } = useApp();
  const [countPollCreate,setCountPollCreate] = useState(0);
  const [countPollVoted,setCountPollVoted] = useState(0);
  const [countPollMarked,setCountPollMarked] = useState(0);
    
  

  return (
    <aside className="userInfo">
      <div className="userInfo__cover">
        <img src={background} alt="Background-image" className="userInfo__coverImg" />
        <img src={src} alt="Profile-Picture" className="userInfo__avatar" />
      </div>

      <div className="userInfo__meta">
        <h3 className="userInfo__name">{name}</h3>
        <h4 className="userInfo__handle">{userName}</h4>
      </div>

      <div className="userInfo__stats">
        <div className="userInfo__stat">
          <h4 className="userInfo__statNum">{countPollCreate}</h4>
          <p className="userInfo__statLabel">Polls Created</p>
        </div>

        <div className="userInfo__stat">
          <h4 className="userInfo__statNum">{countPollVoted}</h4>
          <p className="userInfo__statLabel">Polls Voted</p>
        </div>

        <div className="userInfo__stat">
          <h4 className="userInfo__statNum">{countPollMarked}</h4>
          <p className="userInfo__statLabel">Polls Bookmarked</p>
        </div>
      </div>
    </aside>
  );
};

export default UserInfo;
