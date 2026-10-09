import "./App.css";
import FinancialPlanner from "./components/FinancialPlanner";

import {useState} from "react";

function App() {
  const [showPlanner, setShowPlanner]=useState(false);
  if(showPlanner){
    return<FinancialPlanner/>;
  }
  return (
    <div className="nexus-app">

      {/* Navigation Bar */}
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
          <button className="login-btn">Login</button>
          <button className="primary-btn">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">

          <div className="badge">
            ✦ Smart Financial Planning for Everyone
          </div>

          <h1>
            Take Control of Your
            <span> Financial Future</span>
          </h1>

          <p>
            NEXUS helps you understand your income, manage expenses,
            create budgets, set financial goals and explore different
            financial scenarios — all in one place.
          </p>

          <div className="hero-buttons">
            <button 
            className="primary-btn"
            onClick={()=>setShowPlanner(true)}
            >
              Start Planning →
            </button>

            <button className="secondary-btn">
              Explore NEXUS
            </button>
          </div>

          <div className="highlights">
            <div>✓ Simple</div>
            <div>✓ Educational</div>
            <div>✓ Built for India</div>
          </div>

        </div>
      </section>

      {/* Financial Overview */}
      <section className="overview">
        <div className="section-heading">
          <p className="small-title">MONTHLY OVERVIEW</p>
          <h2>Understand Your Financial Health</h2>
          <p>
            Get a clear picture of where your money goes every month.
          </p>
        </div>

        <div className="cards">

          <div className="financial-card">
            <div className="card-icon">₹</div>
            <p>Monthly Income</p>
            <h3>₹50,000</h3>
            <span>+8% this month</span>
          </div>

          <div className="financial-card">
            <div className="card-icon">↗</div>
            <p>Total Expenses</p>
            <h3>₹32,400</h3>
            <span>64.8% of income</span>
          </div>

          <div className="financial-card">
            <div className="card-icon">💰</div>
            <p>Total Savings</p>
            <h3>₹12,600</h3>
            <span>25.2% of income</span>
          </div>

          <div className="financial-card">
            <div className="card-icon">🎯</div>
            <p>Active Goals</p>
            <h3>3</h3>
            <span>₹68,000 planned</span>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">

        <div className="section-heading">
          <p className="small-title">WHAT NEXUS OFFERS</p>
          <h2>Everything You Need to Plan Better</h2>
          <p>
            Understand your money, make informed decisions and work
            towards your financial goals.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">💵</div>
            <h3>Income Management</h3>
            <p>
              Record and understand your monthly income and sources.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Expense Tracking</h3>
            <p>
              Track your spending and understand where your money goes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Budget Planner</h3>
            <p>
              Create monthly budgets and monitor your spending.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Financial Goals</h3>
            <p>
              Set savings goals and track your progress over time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>What-If Simulator</h3>
            <p>
              Explore how changes in income and expenses affect your plans.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧮</div>
            <h3>Financial Calculators</h3>
            <p>
              Calculate EMI, interest, savings goals and affordability.
            </p>
          </div>

        </div>

      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">

        <div className="section-heading">
          <p className="small-title">HOW IT WORKS</p>
          <h2>Plan Your Finances in 4 Simple Steps</h2>
        </div>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <h3>Add Your Income</h3>
            <p>Enter your monthly income and other sources.</p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Track Expenses</h3>
            <p>Record your daily and monthly expenses.</p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Set Goals</h3>
            <p>Create savings and financial goals.</p>
          </div>

          <div className="step">
            <div className="step-number">04</div>
            <h3>Plan & Improve</h3>
            <p>Use NEXUS insights and simulations to plan better.</p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          <span className="logo-icon">N</span>
          <span>NEXUS</span>
        </div>

        <p>
          Smart financial planning for a better tomorrow.
        </p>

        <p className="copyright">
          © 2026 NEXUS. Financial awareness and planning platform.
        </p>
      </footer>
      {showPlanner && <FinancialPlanner />}

    </div>
  );
}

export default App;