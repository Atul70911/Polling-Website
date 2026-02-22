import React, { useState, useEffect } from "react";
import { Eye, EyeOff, UserRoundPen } from "lucide-react";
import { useApp } from "../ContextProvider/AppContext";
import "../style/SignUp.css";
import profilePic from "../assets/profile-pic.jpg";

const SignUp = () => {
  const { setPage, register, loading, error, setError } = useApp();

  const [showPassword, setShowPassword] = useState(false);

  // local form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // file + preview
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(profilePic);

  // cleanup object url
  useEffect(() => {
    return () => {
      if (typeof previewSrc === "string" && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError?.(""); // if you exposed setError in context

    try {
      await register({
        name,
        username,
        email,
        password,
        profilePicture: profilePictureFile, // must be a File object
      });

      // after success, go to login
      setPage("Login");
    } catch (err) {
      // context already sets error, but you can keep fallback
      console.error(err);
    }
  };

  return (
    <div className="signup">
      <div className="signup__container">
        <header className="signup__brand">
          <h1 className="signup__title">Polling App</h1>
        </header>

        <main className="signup__card">
          <div className="signup__header">
            <h1 className="signup__heading">Create an Account</h1>
            <p className="signup__subheading">JOIN TO BE A CHANGE</p>
          </div>

          <form className="signup__form" onSubmit={handleRegister}>
            <div className="profileUpload">
              <div className="profileUpload__avatarWrap">
                {previewSrc && (
                  <img
                    className="profileUpload__preview"
                    src={previewSrc}
                    alt="Profile preview"
                  />
                )}

                <label htmlFor="profile-input" className="profileUpload__label" role="button">
                  <UserRoundPen size={18} />
                  <span className="visually-hidden">Change profile photo</span>
                </label>
              </div>

              <input
                id="profile-input"
                className="profileUpload__input visually-hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setProfilePictureFile(file);
                  setPreviewSrc(URL.createObjectURL(file));
                }}
              />
            </div>

            <div className="signup__grid">
              <div className="signup__field">
                <label className="signup__label" htmlFor="name">Name</label>
                <input
                  className="signup__input"
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="signup__field">
                <label className="signup__label" htmlFor="username">Username</label>
                <input
                  className="signup__input"
                  id="username"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="signup__field signup__field--full">
                <label className="signup__label" htmlFor="email">Email</label>
                <input
                  className="signup__input"
                  id="email"
                  type="email"
                  placeholder="gola@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="signup__field signup__field--full">
                <label className="signup__label" htmlFor="password">Password</label>

                <div className="signup__password">
                  <input
                    className="signup__input signup__input--password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="signup__iconBtn"
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="signup__error">{error}</p>}

            <button className="signup__submit" type="submit" disabled={loading}>
              {loading ? "Creating..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="signup__footer">
            <span className="signup__footerText">Already have an Account?</span>
            <button className="signup__linkBtn" type="button" onClick={() => setPage("Login")}>
              Login
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignUp;