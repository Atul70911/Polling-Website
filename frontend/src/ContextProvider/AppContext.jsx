import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import profilePic from "../assets/profile-pic.jpg";

import { loginApi, registerApi, logoutApi } from "../api/user.api";
import { getFeedApi, createPollApi,getPollApi,voteApi,bookmarkApi } from "../api/polls.api";

const AppContext = createContext(null);

const getErrMsg = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

export function AppProvider({ children }) {
  const [page, setPage] = useState("Login");

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [src, setSrc] = useState(profilePic);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [yesNoList, setYesNoList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [singleChoiceList, setSingleChoiceList] = useState([]);
  const [imageBasedList, setImageBasedList] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);

  // actions
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginApi({ email, password });
      
      const loggedInUser = res?.data?.data?.user;
      const accessToken = res?.data?.data?.accessToken; // ✅ 1. Extract token

      // ✅ 2. Save token securely in localStorage so Axios can use it
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      setUser(loggedInUser || null);
      
      return res.data;
    } catch (e) {
      setError(getErrMsg(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, username, email, password, profilePicture }) => {
    setLoading(true);
    setError("");
    try {
      const res = await registerApi({ name, username, email, password, profilePicture });
      setPage("Login");
      return res.data;
    } catch (e) {
      setError(getErrMsg(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError("");
    try {
      await logoutApi();
    } catch (e) {
      console.error("Logout API failed, but clearing local session anyway");
    } finally {
      // ✅ 3. Always clear token and user on logout
      localStorage.removeItem("accessToken");
      setUser(null);
      setPage("Login");
      setLoading(false);
    }
  };

  const createPoll = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const res = await createPollApi(payload);
      return res.data;
    } catch (e) {
      setError(getErrMsg(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const fetchFeed = async ({ page = 1, limit = 50, type } = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await getFeedApi({ page, limit, type });
      const polls = res?.data?.data?.polls || [];

      setYesNoList(polls.filter((p) => p.type === "YesNo"));
      setRatingList(polls.filter((p) => p.type === "Rating"));
      setSingleChoiceList(polls.filter((p) => p.type === "SingleChoice"));
      setImageBasedList(polls.filter((p) => p.type === "ImageBased"));

      return polls;
    } catch (e) {
      setError(getErrMsg(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const fetchPoll = async (pollId) => {
  setLoading(true);
  setError("");

  try {
    const res = await getPollApi(pollId);
    const poll = res?.data?.data;

    return poll;
  } catch (e) {
    setError(getErrMsg(e));
    throw e;
  } finally {
    setLoading(false);
  }
};

const submitVote = async (pollId, payload) => {
  setLoading(true);
  setError("");

  try {
    const res = await voteApi(pollId, payload);

    return res?.data;
  } catch (e) {
    setError(getErrMsg(e));
    throw e;
  } finally {
    setLoading(false);
  }
};

const toggleBookmark = async (pollId) => {
  try {
    const res = await bookmarkApi(pollId);
    return res?.data;
  } catch (e) {
    throw e;
  }
};



  const value = useMemo(
    () => ({
      page, setPage,
      name, setName,
      userName, setUserName,
      email, setEmail,
      src, setSrc,
      user, setUser,

      yesNoList, setYesNoList,
      ratingList, setRatingList,
      singleChoiceList, setSingleChoiceList,
      imageBasedList, setImageBasedList,

      loading,
      error, setError,
      selectedPoll, setSelectedPoll,

      login,
      register,
      logout,
      fetchFeed,
      createPoll, 
      fetchPoll,submitVote,
      getErrMsg,toggleBookmark
    }),
    [
      page, name, userName, email, src, user,
      yesNoList, ratingList, singleChoiceList, imageBasedList,
      loading, error,selectedPoll,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider />");
  return ctx;
}