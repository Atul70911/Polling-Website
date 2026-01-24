import "./App.css";
import VantaBackground from "./Components/VantaBackground";

import CreatePoll from "./Components/CreatePoll";
import SideBar from "./Components/SideBar";
import UserInfo from "./Components/UserInfo";
import DashBoard from "./Components/DashBoard";
import MyPolls from "./Components/MyPolls";
import VotedPolls from "./Components/VotedPolls";
import Bookmarks from "./Components/Bookmarks";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";

import { useApp } from "./ContextProvider/AppContext";

function App() {
  const { page } = useApp();
  const isAuth = page === "Login" || page === "SignUp";

  return (
    <VantaBackground>
      <div className={isAuth ? "authLayout" : "appLayout"}>
        {isAuth ? (
          page === "Login" ? <Login /> : <SignUp />
        ) : (
          <>
            <div className="appLayout__left">
              <SideBar />
            </div>

            <main className="appLayout__middle">
              {page === "DashBoard" && <DashBoard />}
              {page === "CreatePoll" && <CreatePoll />}
              {page === "MyPolls" && <MyPolls />}
              {page === "VotedPolls" && <VotedPolls />}
              {page === "Bookmarks" && <Bookmarks />}
            </main>

            <div className="appLayout__right">
              <UserInfo />
            </div>
          </>
        )}
      </div>
    </VantaBackground>
  );
}

export default App;
