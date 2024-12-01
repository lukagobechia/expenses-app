import { Router } from "express";

import {
  getExpenses,
  getExpensesById,
  addExpenses,
  deleteExpenses,
  updateExpenses,
} from "./expenses.service.js";
import { isValidApiKeyMiddleware } from "../../middlewares/isValidApiKey.middleware.js";
import { requiredField } from "../../middlewares/requiredField.middleware.js";

const expensesRouter = Router();

expensesRouter.get("/", getExpenses);
expensesRouter.get("/:id", getExpensesById);
expensesRouter.post("/", requiredField, addExpenses);
expensesRouter.delete("/:id", deleteExpenses);
expensesRouter.put("/:id", updateExpenses);
export default expensesRouter;
