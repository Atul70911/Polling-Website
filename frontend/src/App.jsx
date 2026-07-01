import "./index.css"

import CreatePoll from "./Pages/CreatePoll";
import UserInfo from "./Pages/UserInfo";
import DashBoard from "./Pages/DashBoard";
import MyPolls from "./Pages/MyPolls";
import VotedPolls from "./Pages/VotedPolls";
import Bookmarks from "./Pages/Bookmarks";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import SideBar from "./Components/SideBar";
import NavBar from "./Components/NavBar"
import Footer from "./Components/Footer"


import { useApp } from "./ContextProvider/AppContext";


function App() {
  const { page } = useApp();
  const isAuth = page === "Login" || page === "SignUp";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuth ? (
        <>
          <NavBar />
          <main className="flex-1 flex items-center justify-center">
            {page === "Login" ? <Login /> : <SignUp />}
          </main>
        </>
      ) : (
        <div className="flex flex-1">
          <div className="w-56 shrink-0">
            <SideBar />
          </div>
          <main className="flex-1 p-6 overflow-y-auto">
            {page === "DashBoard" && <DashBoard />}
            {page === "CreatePoll" && <CreatePoll />}
            {page === "MyPolls" && <MyPolls />}
            {page === "VotedPolls" && <VotedPolls />}
            {page === "Bookmarks" && <Bookmarks />}
          </main>
          <div className="w-64 shrink-0 p-4">
            <UserInfo />
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default App;