import React, { createContext, useContext, useMemo, useState } from "react";
import profilePic from "../assets/profile-pic.jpg";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // navigation
  const [page, setPage] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [userName, setUserName] = useState(null);
  const [src, setSrc] = useState(profilePic);

  // poll lists (same structure you already use)
  const [yesNoList, setYesNoList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [singleChoiceList, setSingleChoiceList] = useState([]);
  const [imageBasedList, setImageBasedList] = useState([]);

  const value = useMemo(
  () => ({
    src, setSrc,
    name, setName,
    email, setEmail,
    password, setPassword,
    userName, setUserName,
    page, setPage,
    yesNoList, setYesNoList,
    ratingList, setRatingList,
    singleChoiceList, setSingleChoiceList,
    imageBasedList, setImageBasedList,
  }),
  [
    src, name, email, password, userName, page,
    yesNoList, ratingList, singleChoiceList, imageBasedList
  ]
);


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider />");
  return ctx;
}
