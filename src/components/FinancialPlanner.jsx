
import { useState, useEffect } from "react";
import api from "../api";
import "./FinancialPlanner.css";

function FinancialPlanner({ userId }) {
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check the backend and load the logged-in user's saved plan.
  useEffect(() => {
    api.get("/api/health").catch((error) => {
      console.error("Backend connection failed:", error);
    });

    if (!userId) {
      return;
    }

    let cancelled = false;

    const loadFinancialPlan = async () => {
      setIsLoading(true);

      try {
        const response = await api.get("/api/financial-plans", {
          params: { userId },
        });

        if (cancelled) return;

        const plans = Array.isArray(response.data)
          ? response.data
          : [];

        if (plans.length === 0) {
          return;
        }

        // Use the most recently returned plan.
        const plan = plans[plans.length - 1];

        setSalary(String(plan.salary ?? ""));
        setRent(String(plan.rent ?? ""));
        setFood(String(plan.food ?? ""));
        setTravel(String(plan.travel ?? ""));
        setBills(String(plan.bills ?? ""));
        setShopping(String(plan.shopping ?? ""));
        setEmi(String(plan.emi ?? ""));
        setGoalName(plan.goalName ?? "");
        setGoalAmount(String(plan.goalAmount ?? ""));
        setGoalMonths(String(plan.goalMonths ?? ""));
        setSavingMethod(plan.savingMethod ?? "");
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load financial plan:", error);
          setSaveMessage(
            "Could not load your saved plan. Please check the backend."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadFinancialPlan();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const income = Number(salary) || 0;

  const regularExpenses =
    (Number(rent) || 0) +
    (Number(food) || 0) +
    (Number(travel) || 0) +
    (Number(bills) || 0) +
    (Number(shopping) || 0);

  const loanEmi = Number(emi) || 0;
  const totalCommitments = regularExpenses + loanEmi;
  const remainingMoney = income - totalCommitments;

  const requiredForGoal =
    Number(goalAmount) > 0 && Number(goalMonths) > 0
      ? Number(goalAmount) / Number(goalMonths)
      : 0;

  const afterGoalSaving = remainingMoney - requiredForGoal;

  const saveFinancialPlan = async () => {
    setSaveMessage("");

    if (!userId) {
      setSaveMessage("Please log in before saving your financial plan.");
      return;
    }

    if (
      salary.trim() === "" ||
      !Number.isFinite(Number(salary)) ||
      income < 0
    ) {
      setSaveMessage("Please enter a valid monthly income.");
      return;
    }

    const expenseValues = [
      rent,
      food,
      travel,
      bills,
      shopping,
      emi,
      goalAmount,
      goalMonths,
    ];

    if (
      expenseValues.some(
        (value) =>
          value.trim() !== "" &&
          (!Number.isFinite(Number(value)) || Number(value) < 0)
      )
    ) {
      setSaveMessage(
        "Please enter valid non-negative amounts and months."
      );
      return;
    }

    if (
      (goalAmount.trim() !== "" || goalMonths.trim() !== "") &&
      (!(Number(goalAmount) > 0) ||
        !(Number(goalMonths) > 0) ||
        !Number.isInteger(Number(goalMonths)))
    ) {
      setSaveMessage(
        "Enter a positive goal amount and a whole-number time period."
      );
      return;
    }

    setIsSaving(true);

    try {
      await api.post("/api/financial-plans", {
        userId: Number(userId),
        salary: income,
        rent: Number(rent) || 0,
        food: Number(food) || 0,
        travel: Number(travel) || 0,
        bills: Number(bills) || 0,
        shopping: Number(shopping) || 0,
        emi: loanEmi,
        goalName: goalName.trim(),
        goalAmount: Number(goalAmount) || 0,
        goalMonths: Number(goalMonths) || 0,
        savingMethod,
      });

      setSaveMessage("Financial plan saved successfully!");
    } catch (error) {
      console.error("Could not save financial plan:", error);

      setSaveMessage(
        error.response?.data?.message ||
          "Could not save the plan. Please check that the backend is running."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="planner-page">
      <div className="planner-header">
        <p className="small-title">NEXUS FINANCIAL PLANNER</p>
        <h1>Plan Your Money Smarter</h1>
        <p>
          Enter your income, expenses, EMI and savings goal.
          NEXUS calculates your monthly financial position.
        </p>
      </div>

      {isLoading && (
        <p role="status">Loading your saved financial plan...</p>
      )}

      <div className="planner-card">
        <h2>1. Your Monthly Income</h2>

        <label htmlFor="salary">Monthly Salary / Income (₹)</label>
        <input
          id="salary"
          type="number"
          min="0"
          step="0.01"
          placeholder="Example: 50000"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
      </div>

      <div className="planner-card">
        <h2>2. Monthly Expenses</h2>

        <div className="input-grid">
          <div>
            <label htmlFor="rent">Rent / Housing (₹)</label>
            <input
              id="rent"
              type="number"
              min="0"
              placeholder="Example: 10000"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="food">Food (₹)</label>
            <input
              id="food"
              type="number"
              min="0"
              placeholder="Example: 5000"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="travel">Travel / Transport (₹)</label>
            <input
              id="travel"
              type="number"
              min="0"
              placeholder="Example: 2000"
              value={travel}
              onChange={(e) => setTravel(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="bills">Bills / Utilities (₹)</label>
            <input
              id="bills"
              type="number"
              min="0"
              placeholder="Example: 1500"
              value={bills}
              onChange={(e) => setBills(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="shopping">Shopping / Other (₹)</label>
            <input
              id="shopping"
              type="number"
              min="0"
              placeholder="Example: 2000"
              value={shopping}
              onChange={(e) => setShopping(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="planner-card">
        <h2>3. Loans & EMI</h2>

        <label htmlFor="emi">Total Monthly EMI (₹)</label>
        <input
          id="emi"
          type="number"
          min="0"
          placeholder="Example: 8000"
          value={emi}
          onChange={(e) => setEmi(e.target.value)}
        />

        <p className="helper-text">
          Enter the total amount you pay towards loans every month.
        </p>
      </div>

      <div className="planner-card">
        <h2>4. Future Financial Goal</h2>

        <div className="input-grid">
          <div>
            <label htmlFor="goalName">Goal Name</label>
            <input
              id="goalName"
              type="text"
              placeholder="Example: Emergency Fund"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="goalAmount">Goal Amount (₹)</label>
            <input
              id="goalAmount"
              type="number"
              min="0"
              placeholder="Example: 120000"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="goalMonths">Time Period (Months)</label>
            <input
              id="goalMonths"
              type="number"
              min="1"
              step="1"
              placeholder="Example: 12"
              value={goalMonths}
              onChange={(e) => setGoalMonths(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="savingMethod">
              Preferred Saving Method
            </label>

            <select
              id="savingMethod"
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

      <div className="planner-results">
        <div className="planner-card result-card">
          <h2>Your NEXUS Financial Summary</h2>

          <div className="result-grid">
            <div>
              <span>Monthly Income</span>
              <strong>₹{money(income)}</strong>
            </div>

            <div>
              <span>Regular Expenses</span>
              <strong>₹{money(regularExpenses)}</strong>
            </div>

            <div>
              <span>Total EMI</span>
              <strong>₹{money(loanEmi)}</strong>
            </div>

            <div>
              <span>Total Monthly Commitments</span>
              <strong>₹{money(totalCommitments)}</strong>
            </div>

            <div>
              <span>Available Balance</span>
              <strong>₹{money(remainingMoney)}</strong>
            </div>

            <div>
              <span>Goal Saving / Month</span>
              <strong>₹{money(requiredForGoal)}</strong>
            </div>

            <div>
              <span>Balance After Goal Saving</span>
              <strong>₹{money(afterGoalSaving)}</strong>
            </div>
          </div>

          {goalName.trim() && (
            <div className="goal-result">
              <h3>Goal: {goalName}</h3>

              {requiredForGoal > 0 ? (
                <p>
                  Save approximately{" "}
                  <strong>₹{money(requiredForGoal)}</strong> every
                  month to reach your goal in {goalMonths} months.
                </p>
              ) : (
                <p>
                  Enter a goal amount and time period to calculate
                  monthly savings.
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={saveFinancialPlan}
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save Financial Plan"}
          </button>

          {saveMessage && (
            <p role="status" aria-live="polite">
              {saveMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialPlanner;
