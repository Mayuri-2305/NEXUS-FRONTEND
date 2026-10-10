import { useEffect, useMemo, useState } from "react";

import "./App.css";

import FinancialPlanner from "./components/FinancialPlanner";

import api from "./api";



function App() {

  const [showDashboard, setShowDashboard] = useState(false);

  const [showPlanner, setShowPlanner] = useState(false);

  const [authMode, setAuthMode] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [authMessage, setAuthMessage] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [dashboardPlan, setDashboardPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  // Load the logged-in user's saved financial plan whenever the dashboard opens.
  useEffect(() => {
    if (!showDashboard || !loggedInUser?.id) return;

    let cancelled = false;
    const loadDashboardPlan = async () => {
      setPlanLoading(true);
      setPlanError("");
      try {
        const response = await api.get("/api/financial-plans", {
          params: { userId: loggedInUser.id },
        });
        const plans = Array.isArray(response.data) ? response.data : [];
        const latestPlan = [...plans].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0] ?? null;
        if (!cancelled) setDashboardPlan(latestPlan);
      } catch (error) {
        console.error("Could not load dashboard financial plan:", error);
        if (!cancelled) {
          setDashboardPlan(null);
          setPlanError("We couldn't load your saved financial plan. Please try again.");
        }
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    };

    loadDashboardPlan();
    return () => { cancelled = true; };
  }, [showDashboard, loggedInUser?.id]);

  const dashboardNumbers = useMemo(() => {
    if (!dashboardPlan) return null;
    const amount = (value) => Number(value ?? 0) || 0;
    const income = amount(dashboardPlan.salary);
    const expenses = amount(dashboardPlan.rent) + amount(dashboardPlan.food) +
      amount(dashboardPlan.travel) + amount(dashboardPlan.bills) +
      amount(dashboardPlan.shopping) + amount(dashboardPlan.emi);
    const available = income - expenses;
    const goalAmount = amount(dashboardPlan.goalAmount);
    const goalMonths = amount(dashboardPlan.goalMonths);
    const monthlyGoalSaving = goalMonths > 0 ? goalAmount / goalMonths : 0;
    return { income, expenses, available, goalAmount, goalMonths, monthlyGoalSaving };
  }, [dashboardPlan]);

  const formatRupees = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(value ?? 0);

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

        setAuthMessage("");

        setAuthMode("");

        setShowPlanner(false);

        setShowDashboard(true);

        setPassword("");

      }

    } catch (error) {

      console.error("Authentication error:", error);



      if (error.response?.status === 409) {

        setAuthMessage("This email is already registered. Please log in.");

      } else if (

        error.response?.status === 401 ||

        error.response?.status === 403

      ) {

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



  const openDashboard = () => {

    setShowPlanner(false);

    setShowDashboard(true);

    setAuthMessage("");

  };



  const openPlanner = () => {

    setShowDashboard(false);

    setShowPlanner(true);

  };



  const logout = () => {

    setLoggedInUser(null);

    setShowDashboard(false);

    setShowPlanner(false);

    setAuthMode("");

    setName("");

    setEmail("");

    setPassword("");

    setAuthMessage("You have logged out.");

  };



  // Financial Planner

  if (showPlanner && loggedInUser) {

    return (

      <div className="planner-page">

        <header className="app-topbar">

          <button

            type="button"

            className="text-btn"

            onClick={openDashboard}

          >

            ← Back to Dashboard

          </button>



          <div className="topbar-brand">

            <span className="logo-icon">N</span>

            NEXUS

          </div>



          <button type="button" className="text-btn" onClick={logout}>

            Logout

          </button>

        </header>



        <main className="planner-content">

          <FinancialPlanner userId={loggedInUser?.id} />

        </main>

      </div>

    );

  }



  // Personal Dashboard

  if (showDashboard && loggedInUser) {

    const displayName =

      loggedInUser.name || loggedInUser.email?.split("@")[0] || "User";



    return (

      <div className="dashboard-page">

        <header className="app-topbar">

          <button

            type="button"

            className="topbar-brand brand-button"

            onClick={openDashboard}

          >

            <span className="logo-icon">N</span>

            NEXUS

          </button>



          <div className="topbar-user">

            <span className="user-avatar">

              {displayName.charAt(0).toUpperCase()}

            </span>

            <span className="user-email">{loggedInUser.email}</span>

            <button type="button" className="text-btn" onClick={logout}>

              Logout

            </button>

          </div>

        </header>



        <main className="dashboard-content">

          <section className="dashboard-welcome">

            <div>

              <p className="eyebrow">YOUR PERSONAL FINANCE SPACE</p>

              <h1>

                Welcome back, {displayName.split(" ")[0]}!

              </h1>

              <p className="welcome-description">

                Take a moment to understand your money and plan your next

                financial goal.

              </p>

            </div>



            <div className="welcome-icon" aria-hidden="true">

              ₹

            </div>

          </section>



          <section className="summary-section">

            <div className="section-heading">

              <div>

                <h2>Your financial overview</h2>

                <p>Your summary will grow as you create your financial plan.</p>

              </div>

            </div>



            <div className="summary-grid">

              <article className="summary-card">

                <div className="summary-card-top">

                  <span className="summary-icon income-icon">↗</span>

                  <span className="summary-label">Monthly income</span>

                </div>

                <p className="summary-value">{planLoading ? "Loading..." : dashboardNumbers ? formatRupees(dashboardNumbers.income) : "Not set yet"}</p>

                <p className="summary-note">
                  {dashboardNumbers ? "Your saved monthly salary" : "Add your income in Financial Planner"}
                </p>

              </article>



              <article className="summary-card">

                <div className="summary-card-top">

                  <span className="summary-icon expense-icon">↘</span>

                  <span className="summary-label">Monthly expenses</span>

                </div>

                <p className="summary-value">{planLoading ? "Loading..." : dashboardNumbers ? formatRupees(dashboardNumbers.expenses) : "Not set yet"}</p>

                <p className="summary-note">
                  {dashboardNumbers ? "Including your EMI" : "Record your monthly expenses"}
                </p>

              </article>



              <article className="summary-card">

                <div className="summary-card-top">

                  <span className="summary-icon balance-icon">₹</span>

                  <span className="summary-label">Available balance</span>

                </div>

                <p className="summary-value">{planLoading ? "Loading..." : dashboardNumbers ? formatRupees(dashboardNumbers.available) : "Not calculated"}</p>

                <p className="summary-note">
                  {dashboardNumbers ? (dashboardNumbers.available >= 0 ? "Remaining after listed expenses" : "Expenses exceed your income") : "Calculated from your financial details"}
                </p>

              </article>

            </div>

          </section>



          <section className="dashboard-lower-grid">

            <article className="dashboard-panel goal-panel">

              <div className="panel-heading">

                <div>

                  <p className="eyebrow">PLAN FOR TOMORROW</p>

                  <h2>Your savings goal</h2>

                </div>

                <span className="panel-symbol">◎</span>

              </div>



              <p className="panel-description">
                {planLoading
                  ? "Loading your saved goal..."
                  : dashboardNumbers && dashboardNumbers.goalAmount > 0
                    ? `Your goal: ${dashboardPlan.goalName || "Savings goal"} — ${formatRupees(dashboardNumbers.goalAmount)}.`
                    : "Set a savings target and track the monthly amount needed to work toward it."}
              </p>

              {dashboardNumbers && dashboardNumbers.goalAmount > 0 ? (
                <div className="goal-details">
                  <strong>{formatRupees(dashboardNumbers.monthlyGoalSaving)} / month</strong>
                  <span>Suggested amount to reach your target in {dashboardNumbers.goalMonths} month{dashboardNumbers.goalMonths === 1 ? "" : "s"}.</span>
                </div>
              ) : (
                <div className="goal-progress-track">
                  <div className="goal-progress-fill" />
                </div>
              )}

              <div className="goal-progress-labels">
                <span>{dashboardNumbers && dashboardNumbers.goalAmount > 0 ? "Savings target" : "Goal details appear after setup"}</span>
                <span>{dashboardNumbers && dashboardNumbers.goalAmount > 0 ? formatRupees(dashboardNumbers.goalAmount) : "—"}</span>
              </div>
              {planError && <p className="dashboard-data-message" role="status">{planError}</p>}
              {!planLoading && !planError && !dashboardPlan && (
                <p className="dashboard-data-message" role="status">No saved financial plan was found. Create and save one to see your numbers here.</p>
              )}

              <button

                type="button"

                className="primary-btn full-width-btn"

                onClick={openPlanner}

              >

                Set Up My Financial Plan →

              </button>

            </article>



            <article className="dashboard-panel actions-panel">

              <p className="eyebrow">QUICK ACTIONS</p>

              <h2>What would you like to do?</h2>



              <button

                type="button"

                className="action-link"

                onClick={openPlanner}

              >

                <span className="action-icon">₹</span>

                <span className="action-copy">

                  <strong>Financial Planner</strong>

                  <small>Enter income, expenses and savings goals</small>

                </span>

                <span className="action-arrow">→</span>

              </button>



              <div className="action-divider" />



              <button

                type="button"

                className="action-link"

                onClick={() =>

                  document.getElementById("money-tips")?.scrollIntoView({

                    behavior: "smooth",

                  })

                }

              >

                <span className="action-icon">✦</span>

                <span className="action-copy">

                  <strong>Money management tips</strong>

                  <small>Build healthier financial habits</small>

                </span>

                <span className="action-arrow">→</span>

              </button>

            </article>

          </section>



          <section id="money-tips" className="tips-section">

            <p className="eyebrow">NEXUS FINANCIAL LEARNING</p>

            <h2>Small steps make a difference</h2>



            <div className="tips-grid">

              <article className="tip-card">

                <span className="tip-number">01</span>

                <h3>Know your spending</h3>

                <p>

                  Review your regular expenses to understand where your

                  money goes each month.

                </p>

              </article>



              <article className="tip-card">

                <span className="tip-number">02</span>

                <h3>Save with a purpose</h3>

                <p>

                  Choose a realistic savings target and work toward it

                  consistently.

                </p>

              </article>



              <article className="tip-card">

                <span className="tip-number">03</span>

                <h3>Plan before spending</h3>

                <p>

                  Set a budget for essentials, personal spending and

                  future needs.

                </p>

              </article>

            </div>

          </section>



          <footer className="site-footer">

            © NEXUS — Personalized Financial Planning

          </footer>

        </main>

      </div>

    );

  }



  // Login and Registration

  if (authMode) {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <button

            type="button"

            className="text-btn auth-back"

            onClick={() => {

              setAuthMode("");

              setAuthMessage("");

            }}

          >

            ← Back to Home

          </button>



          <div className="auth-brand">

            <span className="logo-icon">N</span>

            <span>NEXUS</span>

          </div>



          <p className="eyebrow">YOUR FINANCIAL JOURNEY STARTS HERE</p>



          <h1>

            {authMode === "login"

              ? "Welcome back"

              : "Create your account"}

          </h1>



          <p className="auth-description">

            {authMode === "login"

              ? "Log in to continue planning your financial future."

              : "Join NEXUS and take the first step toward smarter money management."}

          </p>



          <form onSubmit={handleAuth} className="auth-form">

            {authMode === "register" && (

              <label>

                Full name

                <input

                  type="text"

                  placeholder="Enter your full name"

                  value={name}

                  onChange={(e) => setName(e.target.value)}

                  autoComplete="name"

                  required

                />

              </label>

            )}



            <label>

              Email address

              <input

                type="email"

                placeholder="you@example.com"

                value={email}

                onChange={(e) => setEmail(e.target.value)}

                autoComplete="email"

                required

              />

            </label>



            <label>

              Password

              <input

                type="password"

                placeholder="Enter your password"

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                autoComplete={

                  authMode === "login" ? "current-password" : "new-password"

                }

                required

              />

            </label>



            <button type="submit" className="primary-btn full-width-btn">

              {authMode === "login" ? "Login to NEXUS" : "Create Account"}

            </button>

          </form>



          {authMessage && (

            <p

              className={`auth-message ${

                authMessage.toLowerCase().includes("successful")

                  ? "success-message"

                  : ""

              }`}

              role="status"

            >

              {authMessage}

            </p>

          )}



          <div className="auth-switch">

            {authMode === "login"

              ? "Don't have an account?"

              : "Already have an account?"}



            <button

              type="button"

              className="inline-link"

              onClick={() => {

                setAuthMode(authMode === "login" ? "register" : "login");

                setAuthMessage("");

              }}

            >

              {authMode === "login" ? "Register" : "Login"}

            </button>

          </div>

        </div>

      </div>

    );

  }



  // Public Home Page

  return (

    <div className="nexus-app">

      <nav className="navbar">

        <button

          type="button"

          className="logo brand-button"

          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}

        >

          <span className="logo-icon">N</span>

          <span>NEXUS</span>

        </button>



        <div className="nav-links">

          <a href="#features">Features</a>

          <a href="#how-it-works">How It Works</a>

          <a href="#learn">Learn</a>

        </div>



        <div className="nav-buttons">

          {loggedInUser ? (

            <>

              <button

                type="button"

                className="login-btn"

                onClick={openDashboard}

              >

                My Dashboard

              </button>

              <button type="button" className="text-btn" onClick={logout}>

                Logout

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

          <div className="hero-badge">

            ✦ Smart Financial Planning for Everyone

          </div>



          <h1>

            Take Control of Your <span>Financial Future</span>

          </h1>



          <p>

            NEXUS helps you understand your income, manage expenses, create

            budgets, set financial goals and explore your financial future

            — all in one place.

          </p>



          <div className="hero-buttons">

            <button

              type="button"

              className="primary-btn"

              onClick={() => {

                if (loggedInUser) {

                  openDashboard();

                } else {

                  setAuthMode("register");

                  setAuthMessage("");

                }

              }}

            >

              {loggedInUser ? "Go to Dashboard →" : "Start Planning →"}

            </button>



            <button

              type="button"

              className="secondary-btn"

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

            ✓ Simple <span>✓ Educational</span> ✓ Built for India

          </p>

        </div>



        <div className="hero-visual" aria-hidden="true">

          <div className="visual-orbit orbit-one" />

          <div className="visual-orbit orbit-two" />

          <div className="visual-center">

            <span>₹</span>

            <small>Plan smarter</small>

          </div>

          <div className="floating-note note-one">

            <span>↗</span>

            Build your savings

          </div>

          <div className="floating-note note-two">

            <span>✓</span>

            Your goals matter

          </div>

        </div>

      </section>



      <section id="features" className="features-section">

        <div className="section-heading centered-heading">

          <p className="eyebrow">WHAT NEXUS OFFERS</p>

          <h2>Make your money work for you</h2>

          <p>Tools to help you make more informed financial decisions.</p>

        </div>



        <div className="features-grid">

          <article className="feature-card">

            <span className="feature-icon">↗</span>

            <h3>Income & Expenses</h3>

            <p>

              Understand your monthly income and track your everyday

              expenses.

            </p>

          </article>



          <article className="feature-card">

            <span className="feature-icon">▤</span>

            <h3>Budget Planning</h3>

            <p>

              Organize your spending and make a budget that fits your needs.

            </p>

          </article>



          <article className="feature-card">

            <span className="feature-icon">◎</span>

            <h3>Financial Goals</h3>

            <p>

              Set savings targets for important purchases and future plans.

            </p>

          </article>

        </div>

      </section>



      <section id="how-it-works" className="how-section">

        <div className="section-heading centered-heading">

          <p className="eyebrow">THREE SIMPLE STEPS</p>

          <h2>Your journey with NEXUS</h2>

        </div>



        <div className="steps-grid">

          <article className="step-card">

            <span className="step-number">01</span>

            <h3>Create an account</h3>

            <p>Register and log in to access your personal workspace.</p>

          </article>



          <article className="step-card">

            <span className="step-number">02</span>

            <h3>Build your plan</h3>

            <p>Enter your income, expenses and financial goals.</p>

          </article>



          <article className="step-card">

            <span className="step-number">03</span>

            <h3>Plan your future</h3>

            <p>Use your financial information to make informed decisions.</p>

          </article>

        </div>

      </section>



      <section id="learn" className="learn-section">

        <div>

          <p className="eyebrow">FINANCIAL LITERACY</p>

          <h2>Better financial habits start with understanding.</h2>

          <p>

            Learn to budget, build savings habits and set realistic goals.

            Small, consistent steps can help you become more confident about

            managing money.

          </p>

        </div>



        <button

          type="button"

          className="primary-btn"

          onClick={() => {

            if (loggedInUser) {

              openDashboard();

            } else {

              setAuthMode("register");

              setAuthMessage("");

              window.scrollTo({ top: 0, behavior: "smooth" });

            }

          }}

        >

          Get Started →

        </button>

      </section>



      <footer className="site-footer">

        <div className="footer-brand">

          <span className="logo-icon">N</span>

          NEXUS

        </div>

        <p>Personalized Financial Planning</p>

        <p>© NEXUS. Built to support smarter financial decisions.</p>

      </footer>

    </div>

  );

}



export default App;