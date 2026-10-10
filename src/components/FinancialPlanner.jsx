import { useState, useEffect } from "react";
import api from "../api";
import "./FinancialPlanner.css";

function FinancialPlanner() {
  useEffect(() => {
  api.get("/api/health")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Backend connection failed:", error);
    });
}, []);
  const [salary, setSalary] = useState("");
  const [rent, setRent] = useState("");
  const [food, setFood] = useState("");
  const [travel, setTravel] = useState("");
  const [bills, setBills] = useState("");
  const [shopping, setShopping] = useState("");
  const [emi, setEmi] = useState("");

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalMonths, setGoalMonths] = useState("");
  const [savingMethod, setSavingMethod] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const saveFinancialPlan = async () => {
  try {
    await api.post("/api/financial-plans", {
      salary: Number(salary) || 0,
      rent: Number(rent) || 0,
      food: Number(food) || 0,
      travel: Number(travel) || 0,
      bills: Number(bills) || 0,
      shopping: Number(shopping) || 0,
      emi: Number(emi) || 0,
      goalName,
      goalAmount: Number(goalAmount) || 0,
      goalMonths: Number(goalMonths) || 0,
      savingMethod,
    });

    setSaveMessage("Financial plan saved successfully!");
  } catch (error) {
    setSaveMessage("Could not save. Please check the backend connection.");
    console.error(error);
  }
};

  const calculatePlan = () => {
    const income = Number(salary) || 0;

    const totalExpenses =
      (Number(rent) || 0) +
      (Number(food) || 0) +
      (Number(travel) || 0) +
      (Number(bills) || 0) +
      (Number(shopping) || 0);

    const loanEmi = Number(emi) || 0;

    const totalCommitments = totalExpenses + loanEmi;
    const remainingMoney = income - totalCommitments;

    const requiredForGoal =
      goalAmount && goalMonths
        ? Number(goalAmount) / Number(goalMonths)
        : 0;

    const afterGoalSaving = remainingMoney - requiredForGoal;

    return {
      income,
      totalExpenses,
      loanEmi,
      totalCommitments,
      remainingMoney,
      requiredForGoal,
      afterGoalSaving,
    };
  };

  const plan = calculatePlan();

  return (
    <div className="planner-page">

      <div className="planner-header">
        <p className="small-title">NEXUS FINANCIAL PLANNER</p>

        <h1>Plan Your Money Smarter</h1>

        <p>
          Enter your income, expenses, EMI and future goal.
          NEXUS will calculate your monthly financial position.
        </p>
      </div>

      {/* Income */}

      <div className="planner-card">

        <h2>1. Your Monthly Income</h2>

        <label>Monthly Salary / Income</label>

        <input
          type="number"
          placeholder="Example: 50000"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

      </div>

      {/* Expenses */}

      <div className="planner-card">

        <h2>2. Monthly Expenses</h2>

        <div className="input-grid">

          <div>
            <label>Rent / Housing</label>

            <input
              type="number"
              placeholder="₹"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>

          <div>
            <label>Food</label>

            <input
              type="number"
              placeholder="₹"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>

          <div>
            <label>Travel / Transport</label>

            <input
              type="number"
              placeholder="₹"
              value={travel}
              onChange={(e) => setTravel(e.target.value)}
            />
          </div>

          <div>
            <label>Bills / Utilities</label>

            <input
              type="number"
              placeholder="₹"
              value={bills}
              onChange={(e) => setBills(e.target.value)}
            />
          </div>

          <div>
            <label>Shopping / Other</label>

            <input
              type="number"
              placeholder="₹"
              value={shopping}
              onChange={(e) => setShopping(e.target.value)}
            />
          </div>

        </div>

      </div>

      {/* Loans */}

      <div className="planner-card">

        <h2>3. Loans & EMI</h2>

        <label>Total Monthly EMI</label>

        <input
          type="number"
          placeholder="Example: 8000"
          value={emi}
          onChange={(e) => setEmi(e.target.value)}
        />

        <p className="helper-text">
          Enter the total amount you pay towards loans/EMIs every month.
        </p>

      </div>

      {/* Goal */}

      <div className="planner-card">

        <h2>4. Future Financial Goal</h2>

        <div className="input-grid">

          <div>
            <label>Goal Name</label>

            <input
              type="text"
              placeholder="Example: Emergency Fund"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
          </div>

          <div>
            <label>Goal Amount</label>

            <input
              type="number"
              placeholder="Example: 120000"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />
          </div>

          <div>
            <label>Time Period (Months)</label>

            <input
              type="number"
              placeholder="Example: 12"
              value={goalMonths}
              onChange={(e) => setGoalMonths(e.target.value)}
            />
          <div className="form-group">
             <label>How do you want to save?</label>

                <select
                 value={savingMethod}
                 onChange={(e) => setSavingMethod(e.target.value)}
                >
                <option value="">Select an option</option>
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Bank Savings">Bank Savings</option>
                <option value="Fixed Deposit">Fixed Deposit (FD)</option>
                <option value="Mutual Funds">Mutual Funds</option>
                <option value="Gold">Gold</option>
                <option value="Other">Other</option>
            </select>
        </div>


          </div>

        </div>

      </div>

      {/* Results */}

      <div className="planner-results">

        <div className="planner-card result-card">

          <h2>Your NEXUS Financial Summary</h2>

          <div className="result-grid">

            <div>
              <span>Monthly Income</span>
              <strong>₹{plan.income.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Regular Expenses</span>
              <strong>
                ₹{plan.totalExpenses.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Total EMI</span>
              <strong>
                ₹{plan.loanEmi.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Total Commitments</span>
              <strong>
                ₹{plan.totalCommitments.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Money Remaining</span>
              <strong>
                ₹{plan.remainingMoney.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Goal Saving / Month</span>
              <strong>
                ₹{plan.requiredForGoal.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </strong>
            
            </div>

          </div>

          {goalName && (
            <div className="goal-result">

              <h3>
                Goal: {goalName}
              </h3>

              <p>
                You need approximately{" "}
                <strong>
                  ₹
                  {plan.requiredForGoal.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </strong>{" "}
                per month to reach your goal.
              </p>

              <p>
                After this goal saving, approximately{" "}
                <strong>
                  ₹
                  {plan.afterGoalSaving.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </strong>{" "}
                would remain.
              </p>

            
            <button type="button" onClick= {saveFinancialPlan}>
            Save Financial Plan
            </button>
            {saveMessage && <p>{saveMessage}</p>}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default FinancialPlanner;