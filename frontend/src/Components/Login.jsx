import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../style/Login.css";
import { useApp } from "../ContextProvider/AppContext";

const Login = () => {
  const { setPage, email: savedEmail, password: savedPassword } = useApp();

  const [showPassword, setShowPassword] = useState(false);

  // inputs typed in the login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // avoid full page reload on form submit [web:243]

    if (!savedEmail || !savedPassword) {
      setError("No account found. Please SignUp first.");
      return;
    }

    if (
      loginEmail.trim().toLowerCase() === String(savedEmail).trim().toLowerCase() &&
      loginPassword === String(savedPassword)
    ) {
      setError("");
      setPage("DashBoard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <header className="login__brand">
          <h1 className="login__title">Polling App</h1>
        </header>

        <main className="login__card">
          <div className="login__header">
            <h2 className="login__heading">Welcome Back..!!</h2>
            <p className="login__subheading">Please enter your details to log in</p>
          </div>

          <form className="login__form" onSubmit={handleLogin}>
            <div className="login__field">
              <label className="login__label" htmlFor="email">
                Email Address
              </label>
              <input
                className="login__input"
                id="email"
                type="email"
                required
                placeholder="gola@gmail.com"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="password">
                Password
              </label>

              <div className="login__password">
                <input
                  className="login__input login__input--password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button
                  className="login__iconBtn"
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="login__error">{error}</p>}

            <button className="login__submit" type="submit">
              Login
            </button>
          </form>

          <div className="login__footer">
            <span className="login__footerText">Don't have an account?</span>
            <button className="login__linkBtn" type="button" onClick={() => setPage("SignUp")}>
              SignUp
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
