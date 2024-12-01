import expenseModel from "../../models/expense.js";
import { isValidObjectId } from "mongoose";

export const getExpenses = async (req, res) => {
  try {
    //pagination
    let { page = 1, take = 20 } = req.query;

    if (take < 1) {
      take = 1;
    } else if (take > 20) {
      take = 20;
    }

    const totalExpenseCound = await expenseModel.countDocuments();
    const totalPage = Math.ceil(totalExpenseCound / take);
    if (totalExpenseCound === 0) {
      return res
        .status(200)
        .json({ message: "success, empty array", data: null });
    }
    if (page < 1) {
      page = 1;
    } else if (page > totalPage) {
      page = totalPage;
    }

    const slicedExpense = await expenseModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * take)
      .limit(take);

    const expenses = await expenseModel.find();

    const totalExpense = expenses.reduce((tot, curr) => {
      return (tot += Number(curr.amount));
    }, 0);

    res.status(200).json({ message: "success", data: slicedExpense });
  } catch (error) {
    console.log("Error: ", error.message);
    return res
      .status(500)
      .json({ message: "error retrieving data", data: null });
  }
};
export const getExpensesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Invalid ID format", data: null });
    }
    const expense = await expenseModel.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "expense not found", data: null });
    }
    res.status(200).json({ message: "success", data: expense });
  } catch (error) {
    console.log("Error get: ", error.message);
    return res.status(500).json({ message: "error retrieving data" });
  }
};

export const addExpenses = async (req, res) => {
  try {
    const { category, amount, paymentMethod, date } = req.body;
    
    const newExpense = await expenseModel.create({
      category,
      amount,
      paymentMethod,
      date: date || new Date(),
    });

    res.status(201).json({ message: "New expense created", data: newExpense });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({ message: "Error adding data", data: null });
  }
};

export const deleteExpenses = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      const error = "Invalid ID format";
      return res.status(404).json({ message: "Id not found", data: null });
    }
    const DeletedExpenses = await expenseModel.findByIdAndDelete(id);

    if (!DeletedExpenses) {
      return res.status(404).json({ message: "Could not deleted" });
    }
    res
      .status(200)
      .json({ message: "deleted successfully", data: DeletedExpenses });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({ message: "error deleting data", data: null });
  }
};

export const updateExpenses = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      const error = "Invalid ID format";
      return res.status(404).json({ message: "Id not found", data: null });
    }

    const updatedExpense = await expenseModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedExpense) {
      return res
        .status(400)
        .json({ message: "Expense could not be updated", data: null });
    }

    res
      .status(200)
      .json({ message: "Expense updated successfully", data: updatedExpense });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({ message: "Error updating data", data: null });
  }
};
