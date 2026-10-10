
import { useState } from "react";
import "./App.css";
import FinancialPlanner from "./components/FinancialPlanner";
import api from "./api";

function App() {
  const [showPlanner, setShowPlanner] = useState(false);
  const [authMode, setAuthMode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMessage("Please wait...");

    try {
      if (authMode === "register") {
        await api.post("/api/users", {
          name: name.trim(),
          email: email.trim(),
          password,
        });

        setAuthMessage("Registration successful! You can now log in.");
        setAuthMode("login");
        setName("");
        setPassword("");
      } else {
        const response = await api.post("/api/users/login", {
          email: email.trim(),
          password,
        });

        setLoggedInUser(response.data);
        setAuthMessage("Login successful!");
        setAuthMode("");
        setShowPlanner(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);

      if (error.response?.status === 409) {
        setAuthMessage("This email is already registered. Please log in.");
      } else if (error.response?.status === 401 ||
                 error.response?.status === 403) {
        setAuthMessage("Invalid email or password.");
      } else if (error.response?.status === 400) {
        setAuthMessage("Please check your details and try again.");
      } else {
        setAuthMessage(
          error.response?.data?.message ||
          "Request failed. Check that the backend is running and try again."
        );
      }
    }
  };

  const logout = () => {
    setLoggedInUser(null);
    setShowPlanner(false);
    setAuthMode("");
    setEmail("");
    setPassword("");
    setAuthMessage("You have logged out.");
  };

  if (showPlanner) {
    return (
      <div>
        <button type="button" onClick={() => setShowPlanner(false)}>
          Back to Home
        </button>
        <FinancialPlanner />
      </div>
    );
  }

  if (authMode) {
    return (
      <div className="auth-container">
        <h2>
          {authMode === "login"
            ? "Login to NEXUS"
            : "Create Your NEXUS Account"}
        </h2>

        <form onSubmit={handleAuth}>
          {authMode === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            {authMode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        {authMessage && <p role="status">{authMessage}</p>}

        <p>
          {authMode === "login"
            ? "New to NEXUS?"
            : "Already have an account?"}
          {" "}
          <button
            type="button"
            className="login-btn"
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setAuthMessage("");
            }}
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>

        <button
          type="button"
          onClick={() => {
            setAuthMode("");
            setAuthMessage("");
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="nexus-app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">N</span>
          <span>NEXUS</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#learn">Learn</a>
        </div>

        <div className="nav-buttons">
          {loggedInUser ? (
            <>
              <span>
                Welcome, {loggedInUser.name || loggedInUser.email}
              </span>
              <button type="button" onClick={logout}>
                Logout
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setShowPlanner(true)}
              >
                Open Planner
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="login-btn"
                onClick={() => {
                  setAuthMode("login");
                  setAuthMessage("");
                }}
              >
                Login
              </button>

              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setAuthMode("register");
                  setAuthMessage("");
                }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            ✦ Smart Financial Planning for Everyone
          </div>

          <h1>
            Take Control of Your{" "}
            <span>Financial Future</span>
          </h1>

          <p>
            NEXUS helps you understand your income, manage expenses,
            create budgets, set financial goals and explore different
            financial scenarios — all in one place.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                if (loggedInUser) {
                  setShowPlanner(true);
                } else {
                  setAuthMode("register");
                  setAuthMessage("");
                }
              }}
            >
              Start Planning →
            </button>

            <button
              type="button"
              className="login-btn"
              onClick={() =>
                document.getElementById("features")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore NEXUS
            </button>
          </div>

          <p className="hero-points">
            ✓ Simple &nbsp;&nbsp; ✓ Educational &nbsp;&nbsp; ✓ Built for India
          </p>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <article>
            <h3>Income & Expenses</h3>
            <p>Record your income and track everyday expenses.</p>
          </article>
          <article>
            <h3>Budget Planning</h3>
            <p>Understand your spending and plan your monthly budget.</p>
          </article>
          <article>
            <h3>Financial Goals</h3>
            <p>Plan savings for purchases and future goals.</p>
          </article>
        </div>
      </section>

      <section id="how-it-works" className="features-section">
        <h2>How It Works</h2>
        <p>
          Create an account, enter your financial details, and use your
          plan to understand your savings goals.
        </p>
      </section>

      <section id="learn" className="features-section">
        <h2>Learn About Money</h2>
        <p>
          Build better budgeting and saving habits with NEXUS.
        </p>
      </section>

      <footer>
        <p>© NEXUS — Personalized Financial Planning</p>
      </footer>
    </div>
  );
}

export default App;
