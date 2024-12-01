import React, { useState, useEffect } from "react";
import "./app.css";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("http://localhost:3000/expenses");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setExpenses(data.data || []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      }
    };
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    if (amount && paymentMethod && category) {
      const newExpense = {
        category,
        amount,
        paymentMethod,
        date: new Date(date).toISOString(),
      };

      try {
        const res = await fetch("http://localhost:3000/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExpense),
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const createdExpense = await res.json();
        setExpenses((prevExpenses) => [...prevExpenses, createdExpense.data]);
        resetForm();
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    } else {
      console.error("All fields are required.");
    }
  };

  const updateExpense = async (id) => {
    if (amount && paymentMethod && category) {
      const updatedExpense = {
        category,
        amount,
        paymentMethod,
        date: new Date(date).toISOString(),
      };

      try {
        const res = await fetch(`http://localhost:3000/expenses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedExpense),
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const updated = await res.json();
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense._id === id ? updated.data : expense
          )
        );
        setEditingId(null);
        resetForm();
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    } else {
      console.error("All fields are required.");
    }
  };

  const editExpense = (expense) => {
    setEditingId(expense._id);
    setAmount(expense.amount);
    setPaymentMethod(expense.paymentMethod);
    setDate(new Date(expense.date).toISOString().split("T")[0]);
    setCategory(expense.category);
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
  };

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const resetForm = () => {
    setAmount("");
    setPaymentMethod("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>

      <div className="add-expense">
        <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>
        <div className="form-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button
            onClick={editingId ? () => updateExpense(editingId) : addExpense}
            className="add-button"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
          {editingId && (
            <button onClick={cancelEditing} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="total-expenses">
        <h2>Total Expenses</h2>
        <p>${totalExpenses.toFixed(2)}</p>
      </div>

      <div className="expenses-list">
        <h2>Expenses List</h2>
        <div className="sort-control">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
        <div className="expenses">
          {sortedExpenses.map((expense) => (
            <div key={expense._id} className="expense-item">
              <div className="expense-details">
                <h3>{expense.paymentMethod}</h3>
                <p>
                  {new Date(expense.date).toLocaleDateString()} -{" "}
                  {expense.category}
                </p>
              </div>
              <div className="expense-amount">
                <p>${Number(expense.amount).toFixed(2)}</p>
                <button
                  onClick={() => editExpense(expense)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(expense._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
